let screenTop = 30;
let dockHeight = 46;
let screenBottom = window.innerHeight-dockHeight;
let screenLeft = 0;
let screenRight = window.innerWidth;
let screenHeight = screenBottom-screenTop;
let screenWidth = screenRight-screenLeft;

window.addEventListener('resize', calculateBorders);
function calculateBorders() {
	screenTop = 30;
	dockHeight = 46;
	screenBottom = window.innerHeight-dockHeight;
	screenLeft = 0;
	screenRight = window.innerWidth;
	screenHeight = screenBottom-screenTop;
	screenWidth = screenRight-screenLeft;	
}

// ————————————————————————————————————————————————————————————
// WINDOWS
// ————————————————————————————————————————————————————————————

// Stores all active windows
let windows = {}

// Set currently selected window to top
var activeWindow = '';
var zCounter = 0;
function bringToTop(id) {
	if (activeWindow != id) {
		if (activeWindow != '' && windows[activeWindow]['status'] != 'closed') {
			let prevActive = document.querySelector("#"+activeWindow);
			prevActive.dataset.active = 0;
		}
		let target = document.querySelector("#"+id);
		target.style.zIndex = zCounter;
		target.dataset.active = 1;
		zCounter++;
		activeWindow = id;
	
		// Set active indicator
		let indicators = document.querySelectorAll('.dock-indicator');
		for (let indicator of indicators) {
			indicator.dataset.active = 0;
		}
		let indicator = document.querySelector(`.dock-indicator[data-window="${id}"]`);
		if (indicator != null) {
			indicator.dataset.active = 1;
		}
	
		// Set active preview (if one available)
		setActivePreview(id);
	}
}

// Create a new window
let idCounter = 0;
let totalWindows = 0;
function generateWindow(type, source) {
	let fullID = 'window' + idCounter;

	// Set window number for indicator
	if (totalWindows == 0) {
		totalWindows = 1;
	} else {
		totalWindows++;
	}

	let newWindow = document.createElement('div');
	newWindow.classList.add('window', 'minimized');
	newWindow.addEventListener('mousedown', () => {bringToTop(fullID)});
	newWindow.addEventListener('touchstart', () => {bringToTop(fullID)});
	newWindow.id = fullID;

	// Generate titlebar
	let titlebar = document.createElement('div');
	titlebar.classList.add('window-titlebar');
	newWindow.appendChild(titlebar);

	let titleIndicator = document.createElement('div');
	titleIndicator.classList.add('window-titlebar-indicator');
	titleIndicator.innerText = totalWindows;
	titlebar.appendChild(titleIndicator);

	let title = document.createElement('div');
	title.classList.add('window-title');
	title.addEventListener('mousedown', (e) => {moveWindow(e, fullID)});
	title.addEventListener('touchstart', (e) => {moveWindow(e, fullID)});

	let titleName = document.createElement('h3');
	titleName.classList.add('window-title-name');

	// Generate window indicator in dock
	let indicator = document.createElement('div');
	indicator.classList.add('dock-indicator');
	indicator.innerText = totalWindows;
	indicator.dataset.window = fullID;
	indicator.dataset.minimized = 0;
	indicator.dataset.active = 1;
	indicator.addEventListener('click', () => {showWindow(fullID)});
	indicator.addEventListener('click', () => {bringToTop(fullID)});
	indicator.addEventListener('click', () => {resetPosition(fullID)});

	// Style with color and icon
	if (type == 'syllabus') {
		newWindow.dataset.type = 'syllabus';
		newWindow.dataset.color = 'red';
		indicator.dataset.color = 'red';
		titleIndicator.dataset.color = 'red';
		title.innerHTML += `<svg class="window-title-icon" viewBox="0 0 100 100"><polygon points="70 30 70 80 30 80 30 20 60 20 60 10 20 10 20 90 80 90 80 30 70 30"/><rect x="40" y="60" width="20" height="10"/><rect x="40" y="40" width="20" height="10"/><rect x="60" y="20" width="10" height="10"/></svg>`;
		titleName.innerText = 'Syllabus';
	} else if (type == 'resources') {
		newWindow.dataset.type = 'resources';
		newWindow.dataset.color = 'blue';
		indicator.dataset.color = 'blue';
		titleIndicator.dataset.color = 'blue';
		title.innerHTML += `<svg class="window-title-icon" viewBox="0 0 100 100"><path d="m50,30V10H10v80h80V30h-40Zm-30-10h20v10h-20v-10Zm60,60H20v-40h60v40Z"/></svg>`;
		titleName.innerText = 'Schedule';
	} else if (type == 'lessons') {
		newWindow.dataset.type = 'lessons';
		newWindow.dataset.color = 'purple';
		indicator.dataset.color = 'purple';
		titleIndicator.dataset.color = 'purple';
		title.innerHTML += `<svg class="window-title-icon" viewBox="0 0 100 100"><rect x="30" y="80" width="10" height="10"/><rect x="20" y="70" width="10" height="10"/><rect x="10" y="40" width="10" height="30"/><polygon points="40 40 40 50 60 50 60 40 50 40 50 20 40 20 40 30 20 30 20 40 40 40"/><rect x="50" y="10" width="20" height="10"/><rect x="60" y="30" width="20" height="10"/><rect x="80" y="40" width="10" height="30"/><rect x="70" y="70" width="10" height="10"/><rect x="40" y="70" width="20" height="10"/><rect x="60" y="80" width="10" height="10"/></svg>`;
		titleName.innerText = 'Lessons';
	} else if (type == 'projects') {
		newWindow.dataset.type = 'projects';
		newWindow.dataset.color = 'yellow';
		indicator.dataset.color = 'yellow';
		titleIndicator.dataset.color = 'yellow';
		title.innerHTML += `<svg class="window-title-icon" viewBox="0 0 100 100"><polygon points="30 70 20 70 20 60 10 60 10 90 40 90 40 80 30 80 30 70"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="40" width="10" height="10"/><rect x="40" y="30" width="10" height="10"/><polygon points="80 30 80 20 70 20 70 10 60 10 60 20 50 20 50 30 60 30 60 40 70 40 70 50 80 50 80 40 90 40 90 30 80 30"/><rect x="60" y="50" width="10" height="10"/><rect x="50" y="60" width="10" height="10"/><rect x="40" y="70" width="10" height="10"/></svg>`;
		titleName.innerText = 'Projects';
	} else if (type == 'glossary') {
		newWindow.dataset.type = 'glossary';
		newWindow.dataset.color = 'green';
		indicator.dataset.color = 'green';
		titleIndicator.dataset.color = 'green';
		title.innerHTML += `<svg class="window-title-icon" viewBox="0 0 100 100"><rect x="80" y="80" width="10" height="10"/><rect x="70" y="70" width="10" height="10"/><rect x="60" y="60" width="10" height="10"/><rect x="50" y="50" width="10" height="10"/><rect x="30" y="60" width="20" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="10" y="30" width="10" height="20"/><rect x="20" y="20" width="10" height="10"/><rect x="30" y="10" width="20" height="10"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="30" width="10" height="20"/></svg>`;
		titleName.innerText = 'Glossary';
	} else if (type == 'code-editor') {
		newWindow.dataset.type = 'code-editor';
		newWindow.dataset.color = 'pink';
		indicator.dataset.color = 'pink';
		titleIndicator.dataset.color = 'pink';
		title.innerHTML += `<svg class="window-title-icon" viewBox="0 0 100 100"><rect x="10" y="40" width="10" height="10"/><rect x="20" y="30" width="10" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="70" width="10" height="20"/><rect x="40" y="50" width="10" height="20"/><rect x="50" y="30" width="10" height="20"/><rect x="60" y="10" width="10" height="20"/><rect x="70" y="60" width="10" height="10"/><rect x="80" y="50" width="10" height="10"/><rect x="70" y="40" width="10" height="10"/></svg>`;
		titleName.innerText = 'Code Editor';
	}

	title.appendChild(titleName);
	titlebar.appendChild(title);

	let btnMinimize = document.createElement('div');
	let btnMaximize = document.createElement('div');
	let btnClose = document.createElement('div');

	btnMinimize.innerHTML = `<svg viewBox="0 0 100 100"><rect x="10" y="80" width="80" height="10"/></svg>`;
	btnMaximize.innerHTML = `<svg viewBox="0 0 100 100"><path d="m10,10v80h80V10H10Zm10,70V30h60v50H20Z"/></svg>`;
	btnClose.innerHTML = `<svg viewBox="0 0 100 100"><rect x="10" y="80" width="10" height="10"/><rect x="20" y="70" width="10" height="10"/><rect x="30" y="60" width="10" height="10"/><rect x="40" y="40" width="20" height="20"/><rect x="60" y="30" width="10" height="10"/><rect x="70" y="20" width="10" height="10"/><rect x="80" y="10" width="10" height="10"/><rect x="10" y="10" width="10" height="10"/><rect x="20" y="20" width="10" height="10"/><rect x="30" y="30" width="10" height="10"/><rect x="60" y="60" width="10" height="10"/><rect x="70" y="70" width="10" height="10"/><rect x="80" y="80" width="10" height="10"/></svg>`;

	btnMinimize.classList.add('window-btn');
	btnMaximize.classList.add('window-btn');
	btnClose.classList.add('window-btn');

	btnMinimize.addEventListener('click', () => {minimizeWindow(fullID)});
	btnMaximize.addEventListener('click', () => {maximizeWindow(fullID)});
	btnClose.addEventListener('click', () => {closeWindow(fullID)});

	titlebar.appendChild(btnMinimize);
	titlebar.appendChild(btnMaximize);
	titlebar.appendChild(btnClose);

	// Generate content
	let content = document.createElement('div');
	content.classList.add('window-content');
	newWindow.appendChild(content);

	// Generate resizers
	let resizeTopleft = document.createElement('div');
	let resizeTop = document.createElement('div');
	let resizeTopright = document.createElement('div');
	let resizeRight = document.createElement('div');
	let resizeBottomright = document.createElement('div');
	let resizeBottom = document.createElement('div');
	let resizeBottomleft = document.createElement('div');
	let resizeLeft = document.createElement('div');

	resizeTopleft.classList.add('window-resize', 'window-resize-topleft');
	resizeTop.classList.add('window-resize', 'window-resize-top');
	resizeTopright.classList.add('window-resize', 'window-resize-topright');
	resizeRight.classList.add('window-resize', 'window-resize-right');
	resizeBottomright.classList.add('window-resize', 'window-resize-bottomright');
	resizeBottom.classList.add('window-resize', 'window-resize-bottom');
	resizeBottomleft.classList.add('window-resize', 'window-resize-bottomleft');
	resizeLeft.classList.add('window-resize', 'window-resize-left');

	resizeTopleft.addEventListener('mousedown', (e) => {resizeWindow(e, fullID, 'topleft')});
	resizeTop.addEventListener('mousedown', (e) => {resizeWindow(e, fullID, 'top')});
	resizeTopright.addEventListener('mousedown', (e) => {resizeWindow(e, fullID, 'topright')});
	resizeRight.addEventListener('mousedown', (e) => {resizeWindow(e, fullID, 'right')});
	resizeBottomright.addEventListener('mousedown', (e) => {resizeWindow(e, fullID, 'bottomright')});
	resizeBottom.addEventListener('mousedown', (e) => {resizeWindow(e, fullID, 'bottom')});
	resizeBottomleft.addEventListener('mousedown', (e) => {resizeWindow(e, fullID, 'bottomleft')});
	resizeLeft.addEventListener('mousedown', (e) => {resizeWindow(e, fullID, 'left')});

	resizeTopleft.addEventListener('touchstart', (e) => {resizeWindow(e, fullID, 'topleft')});
	resizeTop.addEventListener('touchstart', (e) => {resizeWindow(e, fullID, 'top')});
	resizeTopright.addEventListener('touchstart', (e) => {resizeWindow(e, fullID, 'topright')});
	resizeRight.addEventListener('touchstart', (e) => {resizeWindow(e, fullID, 'right')});
	resizeBottomright.addEventListener('touchstart', (e) => {resizeWindow(e, fullID, 'bottomright')});
	resizeBottom.addEventListener('touchstart', (e) => {resizeWindow(e, fullID, 'bottom')});
	resizeBottomleft.addEventListener('touchstart', (e) => {resizeWindow(e, fullID, 'bottomleft')});
	resizeLeft.addEventListener('touchstart', (e) => {resizeWindow(e, fullID, 'left')});

	newWindow.appendChild(resizeTopleft);
	newWindow.appendChild(resizeTop);
	newWindow.appendChild(resizeTopright);
	newWindow.appendChild(resizeRight);
	newWindow.appendChild(resizeBottomright);
	newWindow.appendChild(resizeBottom);
	newWindow.appendChild(resizeBottomleft);
	newWindow.appendChild(resizeLeft);

	// Add to tracking object with temp values
	windows[fullID] = {
		'top': 0,
		'left': 0,
		'height': 0,
		'width': 0,
		'status': 'open',
		'number': totalWindows,
	}

	// Add to DOM
	let container = document.querySelector('.container');
	container.appendChild(newWindow);
	resetPosition(fullID);

	// Add indicator to dock
	let dockIndicators = document.querySelector('.dock-indicators');
	dockIndicators.append(indicator);
	dockIndicators.dataset.active = 1;
	let dockDivider = document.querySelector('.dock-divider');
	dockDivider.dataset.active = 1;

	// Generate window content
	if (type == 'code-editor') {
		generateCodeEditor(fullID, source);
	}

	setTimeout(() => {
		newWindow.classList.remove('minimized');
		bringToTop(fullID);
	}, 100)

	idCounter++;
}

// Set live window position to stored position
function refreshPosition(id) {
	let target = document.querySelector("#"+id);
	target.style.top = windows[id]['top'] + "px";
	target.style.left = windows[id]['left'] + "px";
	target.style.height = windows[id]['height'] + "px";
	target.style.width = windows[id]['width'] + "px";

	// Responsive sizing for different window types
	if (target.dataset.type == "code-editor") {
		if (windows[id]['width'] < 500) {
			target.dataset.responsive = 1;
		} else {
			target.dataset.responsive = 0;
		}
	}
}
function resetPosition(id) {
	if (window.innerWidth > 1000) {
		windows[id]['top'] = screenHeight*1/6 + screenTop + Math.random()*20-10;
		windows[id]['left'] = screenWidth*1/4 + screenLeft + Math.random()*20-10;
		windows[id]['height'] = screenHeight*2/3 + Math.random()*20-10;
		windows[id]['width'] = screenWidth*1/2 + Math.random()*20-10;
	} else {
		windows[id]['top'] = screenTop + 40 + Math.random()*20-10;
		windows[id]['left'] = screenLeft + 40 + Math.random()*20-10;
		windows[id]['height'] = screenHeight - 80 + Math.random()*20-10;
		windows[id]['width'] = screenWidth - 80 + Math.random()*20-10;
	}
	refreshPosition(id);
}

// Set window indicators to be consecutive
let lastClosed = 0;
function renumberWindows() {
	if (totalWindows != 0) {
		for (let key of Object.keys(windows)) {
			if (windows[key]['number'] > lastClosed && (windows[key]['status'] == 'open' || windows[key]['status'] == 'minimized')) {
				windows[key]['number'] = windows[key]['number']-1;
				let window = document.querySelector('#'+key);
				window.querySelector('.window-titlebar-indicator').innerText = windows[key]['number'];
				document.querySelector(`.dock-indicator[data-window='${key}']`).innerText = windows[key]['number'];
			}
		}
	}
}

// Titlebar buttons
function closeWindow(id) {
	let target = document.querySelector("#"+id);
	lastClosed = windows[id]['number'];
	let container = document.querySelector('.container');
	container.removeChild(target);
	windows[id]['status'] = 'closed';

	// Remove indicator
	let indicator = document.querySelector(`.dock-indicator[data-window="${id}"]`);
	indicator.remove();

	// Check to see any windows active
	let dockIndicators = document.querySelector('.dock-indicators');
	if (dockIndicators.innerHTML == '') {
		let dockDivider = document.querySelector('.dock-divider');
		dockIndicators.dataset.active = 0;
		dockDivider.dataset.active = 0;
	}

	totalWindows--;
	renumberWindows();
}
function maximizeWindow(id) {
	if (windows[id]['top'] == screenTop && windows[id]['left'] == screenLeft && windows[id]['height'] == screenHeight && windows[id]['width'] == screenWidth) {
		resetPosition(id);
	} else {
		windows[id]['top'] = screenTop;
		windows[id]['left'] = screenLeft;
		windows[id]['height'] = screenBottom-screenTop;
		windows[id]['width'] = screenRight-screenLeft;
	}
	refreshPosition(id);
}
function minimizeWindow(id) {
	let target = document.querySelector("#"+id);
	target.classList.add('minimized');
	windows[id]['status'] = 'minimized';

	let indicator = document.querySelector(`.dock-indicator[data-window="${id}"]`);
	indicator.dataset.minimized = 1;
}
function showWindow(id) {
	let target = document.querySelector("#"+id);
	target.classList.remove('minimized');
	windows[id]['status'] = 'open';
	
	let indicator = document.querySelector(`.dock-indicator[data-window="${id}"]`);
	indicator.dataset.minimized = 0;

	bringToTop(id);
}

// Move window by dragging from titlebar
function moveWindow(e1, id) {
	e1.preventDefault();
	let target = document.querySelector("#"+id);
	target.dataset.reposition = 1;
	window.addEventListener('mouseup', endMove);
	window.addEventListener('mousemove', adjustMove);
    window.addEventListener("touchend", endMove);
	window.addEventListener("touchmove", adjustMove);

	// Deactivate previews to avoid mouse capture
	setTimeout(() => {
		deactivatePreviews();
	}, 100)

	// Cursor and titlebar style
	let body = document.querySelector('body');
	body.style.cursor = 'grabbing';
	let title = target.querySelector('.window-title');
	title.dataset.dragging = 1;

	let posX1, posY1;
	if (e1.touches != null) {
		posX1 = e1.touches[0].clientX;
		posY1 = e1.touches[0].clientY;
	} else {
		posX1 = e1.clientX;
		posY1 = e1.clientY;
	}
	var prevPos = [posX1, posY1];

	function adjustMove(e2) {
		let posX, posY;
		if (e2.touches != null) {
			posX = e2.touches[0].clientX;
			posY = e2.touches[0].clientY;
        } else {
			posX = e2.clientX;
			posY = e2.clientY;
			e2.preventDefault();
        }

		let currentPos = [posX, posY];
		let deltaPos = [currentPos[0] - prevPos[0], currentPos[1] - prevPos[1]];

		// Keep window in sync with mouse
		if (currentPos[1] < screenTop) {
			windows[id]['top'] = screenTop;
		} else if (currentPos[1] > screenBottom) {
			windows[id]['top'] = screenBottom;
		} else {
			windows[id]['top'] += deltaPos[1];
		}
		if (currentPos[0] >= screenLeft && currentPos[0] <= screenRight) {
			windows[id]['left'] += deltaPos[0];
		}

		// Bounds
		if (windows[id]['top'] < screenTop) {
			windows[id]['top'] = screenTop;
		}
		if (windows[id]['top'] > screenHeight) {
			windows[id]['top'] = screenHeight;
		}
		if (windows[id]['left'] + windows[id]['width'] < screenLeft+200) {
			windows[id]['left'] = -windows[id]['width']+screenLeft+200;
		}
		if (windows[id]['left'] > screenWidth-200) {
			windows[id]['left'] = screenWidth-200;
		}

		// Snap to size
		let sizer = document.querySelector('.sizer');
		sizer.style.zIndex = zCounter+1;
		if (currentPos[1] <= screenTop + 10) {
			sizer.dataset.pos = 'top';
		} else if (currentPos[1] >= screenBottom - 10) {
			sizer.dataset.pos = 'bottom';
		} else if (currentPos[0] <= screenLeft + 10 && window.innerWidth > 900) {
			sizer.dataset.pos = 'left';
		} else if (currentPos[0] >= screenRight - 10 && window.innerWidth > 900) {
			sizer.dataset.pos = 'right';
		} else {
			sizer.dataset.pos = '';
		}

		// Set position
		refreshPosition(id);

		prevPos = currentPos;
	}

	function endMove() {
		target.dataset.reposition = 0;
		window.removeEventListener('mouseup', endMove);
		window.removeEventListener('mousemove', adjustMove);
		window.removeEventListener("touchend", endMove);
		window.removeEventListener("touchmove", adjustMove);
		setActivePreview(id);
		body.style.cursor = 'unset';
		title.dataset.dragging = 0;

		// If sizer active, snap window position
		let sizer = document.querySelector('.sizer');
		if (sizer.dataset.pos == 'top') {
			windows[id]['top'] = screenTop;
			windows[id]['left'] = screenLeft;
			windows[id]['height'] = screenHeight/2;
			windows[id]['width'] = screenWidth;
		} else if (sizer.dataset.pos == 'right') {
			windows[id]['top'] = screenTop;
			windows[id]['left'] = screenWidth/2 + screenLeft;
			windows[id]['height'] = screenHeight;
			windows[id]['width'] = screenWidth/2;
		} else if (sizer.dataset.pos == 'bottom') {
			windows[id]['top'] = screenHeight/2 + screenTop;
			windows[id]['left'] = screenLeft;
			windows[id]['height'] = screenHeight/2;
			windows[id]['width'] = screenWidth;
		} else if (sizer.dataset.pos == 'left') {
			windows[id]['top'] = screenTop;
			windows[id]['left'] = screenLeft;
			windows[id]['height'] = screenHeight;
			windows[id]['width'] = screenWidth/2;
		}
		sizer.dataset.pos = '';
		refreshPosition(id);
	}
}

// Resize window by dragging from corner
function resizeWindow(e1, id, dir) {
	e1.preventDefault();
	let target = document.querySelector("#"+id);
	target.dataset.reposition = 1;
	window.addEventListener('mouseup', endResize);
	window.addEventListener('mousemove', adjustResize);
	window.addEventListener("touchend", endResize);
	window.addEventListener("touchmove", adjustResize);

	// Deactivate previews to avoid mouse capture
	setTimeout(() => {
		deactivatePreviews();
	}, 100)

	// Force cursor style
	let body = document.querySelector('body');
	if (dir == 'topleft') {
		body.style.cursor = 'nw-resize';
	} else if (dir == 'top') {
		body.style.cursor = 'n-resize';
	} else if (dir == 'topright') {
		body.style.cursor = 'ne-resize';
	} else if (dir == 'right') {
		body.style.cursor = 'e-resize';
	} else if (dir == 'bottomright') {
		body.style.cursor = 'se-resize';
	} else if (dir == 'bottom') {
		body.style.cursor = 's-resize';
	} else if (dir == 'bottomleft') {
		body.style.cursor = 'sw-resize';
	} else if (dir == 'left') {
		body.style.cursor = 'w-resize';
	}

	// Resize window according to exact mouse position
	function adjustResize(e2) {
		const rect = target.getBoundingClientRect();

		let posX, posY;
		if (e2.touches != null) {
			posX = e2.touches[0].clientX;
			posY = e2.touches[0].clientY;
        } else {
			posX = e2.clientX;
			posY = e2.clientY;
			e2.preventDefault();
        }

		// Handle directional resize
		if (dir == 'topleft') {
			windows[id]['left'] = posX;
			windows[id]['width'] += rect.left - posX;
			if (windows[id]['width'] < 300) {
				windows[id]['width'] = 300;
				windows[id]['left'] = rect.right - 300;
			}
			windows[id]['top'] = posY;
			windows[id]['height'] += rect.top - posY;
			if (windows[id]['height'] < 300) {
				windows[id]['height'] = 300;
				windows[id]['top'] = rect.bottom - 300;
			}
			if (windows[id]['top'] < screenTop) {
				windows[id]['top'] = screenTop;
				windows[id]['height'] = rect.bottom - screenTop;
			}
			if (windows[id]['left'] < screenLeft) {
				windows[id]['left'] = screenLeft;
				windows[id]['width'] = rect.right-screenLeft;
			}

		} else if (dir == 'top') {
			windows[id]['top'] = posY;
			windows[id]['height'] += rect.top - posY;
			if (windows[id]['height'] < 300) {
				windows[id]['height'] = 300;
				windows[id]['top'] = rect.bottom - 300;
			}
			if (windows[id]['top'] < screenTop) {
				windows[id]['top'] = screenTop;
				windows[id]['height'] = rect.bottom - screenTop;
			}

		} else if (dir == 'topright') {
			windows[id]['width'] += posX - rect.right;
			if (windows[id]['width'] < 300) {
				windows[id]['width'] = 300;
			}
			if (windows[id]['width'] + windows[id]['left'] > window.innerWidth) {
				windows[id]['left'] = rect.left;
				windows[id]['width'] = window.innerWidth - rect.left;
			}
			windows[id]['top'] = posY;
			windows[id]['height'] += rect.top - posY;
			if (windows[id]['height'] < 300) {
				windows[id]['height'] = 300;
				windows[id]['top'] = rect.bottom - 300;
			}
			if (windows[id]['top'] < screenTop) {
				windows[id]['top'] = screenTop;
				windows[id]['height'] = rect.bottom - screenTop;
			}
			if (windows[id]['width'] + windows[id]['left'] > screenRight) {
				windows[id]['left'] = rect.left;
				windows[id]['width'] = screenRight - rect.left;
			}

		} else if (dir == 'right') {
			windows[id]['width'] += posX - rect.right;
			if (windows[id]['width'] < 300) {
				windows[id]['width'] = 300;
			}
			if (windows[id]['width'] + windows[id]['left'] > screenRight) {
				windows[id]['left'] = rect.left;
				windows[id]['width'] = screenRight - rect.left;
			}

		} else if (dir == 'bottomright') {
			windows[id]['width'] += posX - rect.right;
			if (windows[id]['width'] < 300) {
				windows[id]['width'] = 300;
			}
			windows[id]['height'] += posY - rect.bottom;
			if (windows[id]['height'] < 300) {
				windows[id]['height'] = 300;
			}
			if (windows[id]['top'] + windows[id]['height'] > screenBottom) {
				windows[id]['top'] = rect.top;
				windows[id]['height'] = screenBottom - rect.top;
			}
			if (windows[id]['width'] + windows[id]['left'] > screenRight) {
				windows[id]['left'] = rect.left;
				windows[id]['width'] = screenRight - rect.left;
			}

		} else if (dir == 'bottom') {
			windows[id]['height'] += posY - rect.bottom;
			if (windows[id]['height'] < 300) {
				windows[id]['height'] = 300;
			}
			if (windows[id]['top'] + windows[id]['height'] > screenBottom) {
				windows[id]['top'] = rect.top;
				windows[id]['height'] = screenBottom - rect.top;
			}

		} else if (dir == 'bottomleft') {
			windows[id]['left'] = posX;
			windows[id]['width'] += rect.left - posX;
			if (windows[id]['width'] < 300) {
				windows[id]['width'] = 300;
				windows[id]['left'] = rect.right - 300;
			}
			windows[id]['height'] += posY - rect.bottom;
			if (windows[id]['height'] < 300) {
				windows[id]['height'] = 300;
			}
			if (windows[id]['left'] < screenLeft) {
				windows[id]['left'] = screenLeft;
				windows[id]['width'] = rect.right-screenLeft;
			}
			if (windows[id]['top'] + windows[id]['height'] > screenBottom) {
				windows[id]['top'] = rect.top;
				windows[id]['height'] = screenBottom - rect.top;
			}

		} else if (dir == 'left') {
			windows[id]['left'] = posX;
			windows[id]['width'] += rect.left - posX;
			if (windows[id]['width'] < 300) {
				windows[id]['width'] = 300;
				windows[id]['left'] = rect.right - 300;
			}
			if (windows[id]['left'] < screenLeft) {
				windows[id]['left'] = screenLeft;
				windows[id]['width'] = rect.right-screenLeft;
			}

		}

		refreshPosition(id);
	}

	function endResize() {
		body.style.cursor = 'unset';
		target.dataset.reposition = 0;
		window.removeEventListener('mouseup', endResize);
		window.removeEventListener('mousemove', adjustResize);
		window.removeEventListener("touchend", endResize);
		window.removeEventListener("touchmove", adjustResize);
		setActivePreview(id);
	}
}

// ————————————————————————————————————————————————————————————
// CLOCK
// ————————————————————————————————————————————————————————————

// Calling showTime function at every second
setInterval(showTime, 1000);
 
// Defining showTime funcion
let time = new Date();
function showTime() {
	// Getting current time and date
	let hour = time.getHours();
	let min = time.getMinutes();
	let sec = time.getSeconds();
	am_pm = "AM";

	// Setting time for 12 Hrs format
	if (hour >= 12) {
		if (hour > 12) hour -= 12;
		am_pm = "PM";
	} else if (hour == 0) {
		hr = 12;
		am_pm = "AM";
	}

	hour =
		hour < 10 ? "0" + hour : hour;
	min = min < 10 ? "0" + min : min;
	sec = sec < 10 ? "0" + sec : sec;

	let currentTime =
		time.toDateString() +
		" " +
		hour +
		":" +
		min +
		":" +
		sec +
		" " +
		am_pm;

	// Displaying the time
	document.getElementById(
		"clock"
	).innerText = currentTime;
}
showTime();

// ————————————————————————————————————————————————————————————
// COLORFUL TASKBAR LINKS
// ————————————————————————————————————————————————————————————

let colors = ['red','blue','purple','yellow','green','pink'];
function generateColorfulLink(linkurl, elmnt) {
	let temp = `<a href="${linkurl}">`;
	let colorIndex = 0;
	for (let char of elmnt.innerText) {
		temp += `<span data-color='${colorIndex}'>${char}</span>`;
		colorIndex++;
		if (colorIndex >= colors.length) {
			colorIndex = 0;
		}
	}
	temp += '</a>';
	elmnt.innerHTML = temp;
	elmnt.addEventListener('mouseenter', () => {colorfulLinkLoopStart(elmnt)});
}

function colorfulLinkLoopStart(elmnt) {
	elmnt.addEventListener('mouseleave', colorfulLinkLoopStop);
	for (let char of elmnt.querySelectorAll(`a span`)) {
		let color = parseInt(char.dataset.color);
		color++;
		if (color >= colors.length) {
			color = 0;
		}
		char.style.color = `var(--${colors[color]})`;
		char.dataset.color = color;
	}
	let colorfulLinkLoop = setInterval(() => {
		for (let char of elmnt.querySelectorAll(`a span`)) {
			let color = parseInt(char.dataset.color);
			color++;
			if (color >= colors.length) {
				color = 0;
			}
			char.style.color = `var(--${colors[color]})`;
			char.dataset.color = color;
		}
	}, 100)

	function colorfulLinkLoopStop() {
		clearInterval(colorfulLinkLoop);
		for (let char of elmnt.querySelectorAll(`a span`)) {
			char.style.color = `var(--black)`;
		}
	}
}

generateColorfulLink("https://webprogramming.gdwithgd.com/", document.querySelector('.title'));

// ————————————————————————————————————————————————————————————
// TEXT EDITORS USING CODEMIRROR
// ————————————————————————————————————————————————————————————

let codeMirrors = [];
function generateCodeEditor(id, source) {
	let target = document.querySelector("#"+id);
	let targetContent = target.querySelector('.window-content');

	targetContent.innerHTML = `
		<div class="editor-panel">
			<div class="editor-info">
				<div class="editor-info-name"></div>
				<button class="editor-btn-reset">
					<svg viewBox="0 0 100 100"><rect x="40" y="80" width="20" height="10"/><rect x="30" y="70" width="10" height="10"/><rect x="20" y="60" width="10" height="10"/><polygon points="20 20 10 20 10 50 40 50 40 40 30 40 30 30 20 30 20 20"/><rect x="30" y="20" width="10" height="10"/><rect x="40" y="10" width="20" height="10"/><rect x="60" y="20" width="10" height="10"/><rect x="70" y="30" width="10" height="10"/><rect x="80" y="40" width="10" height="20"/><rect x="70" y="60" width="10" height="10"/><rect x="60" y="70" width="10" height="10"/></svg>
					<span>Reset</span>
				</button>
				<button class="editor-btn-share">
					<svg viewBox="0 0 100 100"><polygon points="80 80 20 80 20 30 40 30 40 20 10 20 10 90 90 90 90 60 80 60 80 80"/><rect x="30" y="50" width="10" height="20"/><rect x="40" y="40" width="10" height="10"/><polygon points="80 30 80 20 70 20 70 30 50 30 50 40 70 40 70 50 80 50 80 40 90 40 90 30 80 30"/><rect x="60" y="10" width="10" height="10"/><rect x="60" y="50" width="10" height="10"/></svg>
					<span>Copy Link</span>
				</button>
			</div>
			<textarea class="editor-text"></textarea>
			<div class="editor-controls">
				<button class="editor-btn-download">
					<svg viewBox="0 0 100 100"><polygon points="35 60 45 60 45 70 55 70 55 60 65 60 65 50 75 50 75 40 55 40 55 10 45 10 45 40 25 40 25 50 35 50 35 60"/><polygon points="80 70 80 80 20 80 20 70 10 70 10 90 90 90 90 70 80 70"/></svg>
					<span>Save</span>
				</button>
				<button class="editor-btn-wrap">
					<svg viewBox="0 0 100 100"><polygon points="10 10 10 20 80 20 80 60 40 60 40 40 30 40 30 50 20 50 20 60 10 60 10 70 20 70 20 80 30 80 30 90 40 90 40 70 90 70 90 10 10 10"/></svg>
					<span>Wrap Text</span>
				</button>
			</div>
		</div>
		<div class="editor-btn-hide">
			<svg viewBox="0 0 100 100"><polygon points="90 45 50 45 50 25 50 15 40 15 40 25 30 25 30 35 20 35 20 45 10 45 10 55 20 55 20 65 30 65 30 75 40 75 40 85 50 85 50 55 90 55 90 45"/><rect x="50" y="40" width="40" height="20"/></svg>
			<span>Editor</span>
			<svg viewBox="0 0 100 100"><polygon points="90 45 50 45 50 25 50 15 40 15 40 25 30 25 30 35 20 35 20 45 10 45 10 55 20 55 20 65 30 65 30 75 40 75 40 85 50 85 50 55 90 55 90 45"/><rect x="50" y="40" width="40" height="20"/></svg>
		</div>
		<div class="editor-preview-container">
			<iframe class="editor-preview"></iframe>
			<h4>Live Preview</h4>
		</div>
	`

	let targetCodeEditor = targetContent.querySelector('.editor-text');
	let targetPreview = targetContent.querySelector('.editor-preview');

	// Create CodeMirror editor
	let targetCodeMirror = CodeMirror.fromTextArea(targetCodeEditor, {
		mode: "htmlmixed",
		lineNumbers: true,
		tabSize: 2,
		lineWrapping: false,
		theme: "gdwithgd",
	});
	targetCodeMirror.on("change", updatePreview);
	function updatePreview() {
		targetPreview.srcdoc = targetCodeMirror.getValue();
	}
	setTimeout(() => {
		targetCodeMirror.refresh();
	}, 300)
	codeMirrors.push(targetCodeMirror);

	// Get source file if specified
	if (source != undefined) {
		targetContent.dataset.source = 1;
		fetchSource();
	} else {
		targetCodeMirror.setValue("<p>Write your code here!</p>");
	}
	let dataBackup;
	async function fetchSource() {
		let displayName = targetContent.querySelector(".editor-info-name");
		displayName.innerText = source;
		const response = await fetch("sources/demos/"+source);
		const data = await response.text();
		dataBackup = data;
		targetCodeMirror.setValue(data);
	}
	// TO DO: What if the file doesnt exist?

	// Reset code
	let targetBtnReset = targetContent.querySelector('.editor-btn-reset');
	targetBtnReset.addEventListener('click', resetCode);
	function resetCode() {
		targetCodeMirror.setValue(dataBackup);
	}

	// Copy shareable link to code
	let targetBtnShare = targetContent.querySelector('.editor-btn-share');
	targetBtnShare.addEventListener('click', shareCode);
	function shareCode() {
		navigator.clipboard.writeText(window.location.href.split('?')[0] + "?demo=" + source);
	}

	// Download code
	let targetBtnDownload = targetContent.querySelector('.editor-btn-download');
	targetBtnDownload.addEventListener('click', downloadCode);
	function downloadCode() {
		let codeBlob = new Blob([ targetCodeMirror.getValue()], { type: 'text/html' })
		blobURL = URL.createObjectURL(codeBlob);
		let tempLink = document.createElement("a");
		tempLink.href = blobURL;
		tempLink.download = fileNameDate();
		tempLink.click();
	}

	// Line wrapping
	let targetBtnWrap = targetContent.querySelector('.editor-btn-wrap');
	let targetWrap = false;
	targetBtnWrap.addEventListener('click', toggleWrap);
	function toggleWrap() {
		targetWrap = !targetWrap;
		targetCodeMirror.setOption('lineWrapping', targetWrap);
	}

	// Show/hide text editor
	let targetBtnHide = targetContent.querySelector('.editor-btn-hide');
	let targetHide = false;
	targetBtnHide.addEventListener('click', toggleHide);
	function toggleHide() {
		targetHide = !targetHide;
		targetContent.dataset.editor = targetHide;
	}
}

// Activate and deactivate previews to avoid mouse capture
function setActivePreview(id) {
	deactivatePreviews();
	let target = document.querySelector("#"+id);
	if (target.dataset.type == 'code-editor') {
		let preview = target.querySelector('.editor-preview');
		preview.style.pointerEvents = 'all';
	}
}
function deactivatePreviews() {
	let previews = document.querySelectorAll('.editor-preview');
	for (let preview of previews) {
		preview.style.pointerEvents = 'none';
	}
}
function activatePreviews() {
	let previews = document.querySelectorAll('.editor-preview');
	for (let preview of previews) {
		preview.style.pointerEvents = 'all';
	}
}

// Create file name for downloading code
function fileNameDate() {
	return "saved-" + time.getFullYear() + "_" + ('0' + (time.getMonth()+1)).slice(-2) + "_" + ('0' + time.getDate()).slice(-2) + "-at-" + String(time.getHours()).padStart(2, '0') + "_" + String(time.getMinutes()).padStart(2, '0') + "_" + String(time.getSeconds()).padStart(2, '0');
}

// Refresh all code editors when tab is visible
document. addEventListener("visibilitychange", refreshEditors);
function refreshEditors() {
	for (let cm of codeMirrors) {
		cm.refresh();
	}
}

// ————————————————————————————————————————————————————————————
// GENERATING CONTENT BASED ON URL
// ————————————————————————————————————————————————————————————

let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
if (params.has("demo")) {
	generateWindow('code-editor', params.get("demo"));
} else {
	generateWindow('syllabus');
}



// TODO: command f for all TODOS
// fix glitches with numbers on codemirror gutter
// maybe make numbers a toggle?