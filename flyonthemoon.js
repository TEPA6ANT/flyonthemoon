/// <reference path=".config/gta3.d.ts" />
/// <reference path=".config/vc.d.ts" />

var p = new Player(0);
var flyMode = false;

var fixedX = 0.0;
var fixedY = 0.0;
var fixedZ = 0.0;
var fixedHeading = 0.0;

var moveSpeed = 2.00;		// скорость полёта
var rotSpeed = 4.0;		// скорость поворота

const VK_F2 = 113;		// активация
const NUM_2 = 98;		// назад
const NUM_3 = 99;		// вниз
const NUM_4 = 100;		// поворот влево
const NUM_6 = 102;		// поворот вправо
const NUM_8 = 104;		// вперёд
const NUM_9 = 105;		// вверх

while (true) 
{
	wait(0);

	if (Pad.IsKeyPressed(VK_F2)) 
	{
		flyMode = !flyMode;

		if (flyMode) 
		{
			var ped = p.getChar();
			if (ped) 
			{
				//фиксируем текущую координату игрока
				var coords = native("GET_CHAR_COORDINATES", ped);
				fixedX = coords.x;
				fixedY = coords.y;
				fixedZ = coords.z;
				fixedHeading = ped.getHeading();
			}
			showTextBox("~r~Fly mode ON");		//не работает
		}
		else 
		{
			showTextBox("~r~Fly mode OFF");		//не работает
		}

		while (Pad.IsKeyPressed(VK_F2)) wait(0);
	}

	if (!flyMode)
	{
		wait(10);
		continue;
	}

	var ped = p.getChar();
	if (!ped) 
	{
		wait(10);
		continue;
	}

	// -=Поворот=-
	if (Pad.IsKeyPressed(NUM_4)) fixedHeading -= rotSpeed;		// влево
	if (Pad.IsKeyPressed(NUM_6)) fixedHeading += rotSpeed;		// вправо

	if (fixedHeading >= 360) fixedHeading -= 360;
	if (fixedHeading < 0)    fixedHeading += 360;

	// -=Перемещение=-
	var rad = fixedHeading * (Math.PI / 180);

	if (Pad.IsKeyPressed(NUM_8))		// вперёд
	{		
		fixedX += Math.sin(rad) * moveSpeed;
		fixedY += Math.cos(rad) * moveSpeed;
	}
	if (Pad.IsKeyPressed(NUM_2))		// назад
	{
		fixedX -= Math.sin(rad) * moveSpeed;
		fixedY -= Math.cos(rad) * moveSpeed;
	}
	if (Pad.IsKeyPressed(NUM_9)) fixedZ += moveSpeed;		// вверх
	if (Pad.IsKeyPressed(NUM_3)) fixedZ -= moveSpeed;		// вниз

	// Применяем позицию и поворот
	native("SET_CHAR_COORDINATES", ped, fixedX, fixedY, fixedZ);
	native("SET_CHAR_HEADING", ped, fixedHeading);

	wait(0);
}