function getUUID(){
	var len=32;
	var radix=16;
	var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	var uuid=[],i;
	radix=radix||chars.length;
	if(len)
		{for(i=0;i<len;i++)uuid[i]=chars[0|Math.random()*radix];}
	else
	  	{var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';uuid[14]='4';
	  		for(i=0;i<36;i++)
	  			{if(!uuid[i]){r=0|Math.random()*16;uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];}}
	  	}
	return uuid.join('');
}

function currentTime(){
	var d = new Date(), str = '';
	str += d.getHours()+':';
	str += d.getMinutes()+':';
	str += d.getSeconds();
	return str;
}