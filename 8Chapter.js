// PROBLEM 1
function MultiplicatorUnitFailure() {
	this.message = 'Failed to multiply';
}

function primitiveMultiply(num1, num2) {
  if (Math.random() < 0.50) {
  	return num1 * num2;
		} else {
			throw new MultiplicatorUnitFailure();
		}
}

function reliablyMultiply(num1, num2) {
	let hasError = false;

	do {
		try {
			console.log(primitiveMultiply(num1, num2));
			hasError = false;
		}
		catch(error) {
			if (error instanceof MultiplicatorUnitFailure) {
				console.log(error.message);
				hasError = true;
			}
			else {
				hasError = false;
				throw error;
			}
		}
	} while (hasError);
}

reliablyMultiply(8, 8);



// PROBLEM 2
const box = {
	locked: true,
	unlock: function() { this.locked = false; },
	lock: function() { this.locked = true;  },
	_content: [],
	get content() {
		if (this.locked) throw new Error("Locked!");
		return this._content;
	}
};


function withBoxUnlocked(func) {
	const locked = box.locked;
	if (locked) box.unlock();

	try {
		func(box.content);
		console.log(box.content);
	}
	catch (error) {
		console.log(error);
	}
	finally {
		if (locked) box.lock();
	}
}

// withBoxUnlocked(array => array.push("Vladic Kostin"));

















