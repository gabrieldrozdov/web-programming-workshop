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
	
		// Set active code preview (if a code editor available)
		setActivePreview(id);
	}
}

// Refresh CodeMirror whenever div dimension changes for code editors
const codeObserver = new ResizeObserver(entries => {
	entries.forEach(entry => {
		codeMirrors[entry.target.id].refresh();
	});
});

// Create a new window
let idCounter = 0;
let totalWindows = 0;
function generateWindow(type, source, section) {
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
	if (type == 'welcome') {
		newWindow.dataset.type = 'welcome';
		newWindow.dataset.color = 'red';
		indicator.dataset.color = 'red';
		titleIndicator.dataset.color = 'red';
		title.innerHTML += `<svg class="window-title-icon" viewBox="0 0 100 100"><rect x="40" y="30" width="10" height="20"/><rect x="50" y="10" width="10" height="20"/><rect x="10" y="10" width="10" height="20"/><rect x="30" y="10" width="10" height="20"/><rect x="20" y="30" width="10" height="20"/><polygon points="60 70 60 60 80 60 80 50 50 50 50 90 60 90 60 80 80 80 80 70 60 70"/><rect x="80" y="60" width="10" height="10"/></svg>`;
		titleName.innerText = 'Welcome!';
	} else if (type == 'documents') {
		newWindow.dataset.type = 'documents';
		newWindow.dataset.color = 'blue';
		indicator.dataset.color = 'blue';
		titleIndicator.dataset.color = 'blue';
		title.innerHTML += `<svg class="window-title-icon" viewBox="0 0 100 100"><polygon points="70 30 70 80 30 80 30 20 60 20 60 10 20 10 20 90 80 90 80 30 70 30"/><rect x="40" y="60" width="20" height="10"/><rect x="40" y="40" width="20" height="10"/><rect x="60" y="20" width="10" height="10"/></svg>`;
		titleName.innerText = 'Documents';
	} else if (type == 'lessons') {
		newWindow.dataset.type = 'lessons';
		newWindow.dataset.color = 'purple';
		indicator.dataset.color = 'purple';
		titleIndicator.dataset.color = 'purple';
		title.innerHTML += `<svg class="window-title-icon" viewBox="0 0 100 100"><rect x="30" y="80" width="10" height="10"/><rect x="20" y="70" width="10" height="10"/><rect x="10" y="40" width="10" height="30"/><polygon points="40 40 40 50 60 50 60 40 50 40 50 20 40 20 40 30 20 30 20 40 40 40"/><rect x="50" y="10" width="20" height="10"/><rect x="60" y="30" width="20" height="10"/><rect x="80" y="40" width="10" height="30"/><rect x="70" y="70" width="10" height="10"/><rect x="40" y="70" width="20" height="10"/><rect x="60" y="80" width="10" height="10"/></svg>`;
		titleName.innerText = 'Lessons';
	} else if (type == 'glossary') {
		newWindow.dataset.type = 'glossary';
		newWindow.dataset.color = 'yellow';
		indicator.dataset.color = 'yellow';
		titleIndicator.dataset.color = 'yellow';
		title.innerHTML += `<svg class="window-title-icon" viewBox="0 0 100 100"><rect x="80" y="80" width="10" height="10"/><rect x="70" y="70" width="10" height="10"/><rect x="60" y="60" width="10" height="10"/><rect x="50" y="50" width="10" height="10"/><rect x="30" y="60" width="20" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="10" y="30" width="10" height="20"/><rect x="20" y="20" width="10" height="10"/><rect x="30" y="10" width="20" height="10"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="30" width="10" height="20"/></svg>`;
		titleName.innerText = 'Glossary';
	} else if (type == 'projects') {
		newWindow.dataset.type = 'projects';
		newWindow.dataset.color = 'green';
		indicator.dataset.color = 'green';
		titleIndicator.dataset.color = 'green';
		title.innerHTML += `<svg class="window-title-icon" viewBox="0 0 100 100"><polygon points="30 70 20 70 20 60 10 60 10 90 40 90 40 80 30 80 30 70"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="40" width="10" height="10"/><rect x="40" y="30" width="10" height="10"/><polygon points="80 30 80 20 70 20 70 10 60 10 60 20 50 20 50 30 60 30 60 40 70 40 70 50 80 50 80 40 90 40 90 30 80 30"/><rect x="60" y="50" width="10" height="10"/><rect x="50" y="60" width="10" height="10"/><rect x="40" y="70" width="10" height="10"/></svg>`;
		titleName.innerText = 'Projects';
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
	if (type == 'welcome') {
		generateWelcome(fullID);
	} else if (type == 'documents') {
		generateDocuments(fullID, source, section);
	} else if (type == 'lessons') {
		generateLessons(fullID, source, section);
	} else if (type == 'projects') {
		generateProjects(fullID, source);
	} else if (type == 'glossary') {
		generateGlossary(fullID, source);
	} else if (type == 'code-editor') {
		generateCodeEditor(fullID, source);
		codeObserver.observe(newWindow);
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
	if (target.dataset.type == "welcome") {
		if (windows[id]['width'] < 700) {
			target.dataset.responsive = 1;
		}else {
			target.dataset.responsive = 0;
		}
	} else if (target.dataset.type == "documents") {
		if (windows[id]['width'] < 700) {
			target.dataset.responsive = 2;
		} else if (windows[id]['width'] < 1200) {
			target.dataset.responsive = 1;
		} else {
			target.dataset.responsive = 0;
		}
	} else if (target.dataset.type == "lessons") {
		if (windows[id]['width'] < 700) {
			target.dataset.responsive = 2;
		} else if (windows[id]['width'] < 1200) {
			target.dataset.responsive = 1;
		} else {
			target.dataset.responsive = 0;
		}
	} else if (target.dataset.type == "glossary") {
		if (windows[id]['width'] < 700) {
			target.dataset.responsive = 2;
		} else if (windows[id]['width'] < 1200) {
			target.dataset.responsive = 1;
		} else {
			target.dataset.responsive = 0;
		}
	} else if (target.dataset.type == "projects") {
		if (windows[id]['width'] < 700) {
			target.dataset.responsive = 2;
		} else if (windows[id]['width'] < 1200) {
			target.dataset.responsive = 1;
		} else {
			target.dataset.responsive = 0;
		}
	} else if (target.dataset.type == "code-editor") {
		if (windows[id]['width'] < 500) {
			target.dataset.responsive = 1;
		} else {
			target.dataset.responsive = 0;
		}
	}
}
function resetPosition(id) {
	if (window.innerWidth > 1000) {
		windows[id]['top'] = screenHeight*1/10 + screenTop + Math.random()*20-10;
		windows[id]['left'] = screenWidth*1/5 + screenLeft + Math.random()*20-10;
		windows[id]['height'] = screenHeight*8/10 + Math.random()*20-10;
		windows[id]['width'] = screenWidth*3/5 + Math.random()*20-10;
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
		body.style.cursor = 'nwse-resize';
	} else if (dir == 'top') {
		body.style.cursor = 'ns-resize';
	} else if (dir == 'topright') {
		body.style.cursor = 'nesw-resize';
	} else if (dir == 'right') {
		body.style.cursor = 'ew-resize';
	} else if (dir == 'bottomright') {
		body.style.cursor = 'nwse-resize';
	} else if (dir == 'bottom') {
		body.style.cursor = 'ns-resize';
	} else if (dir == 'bottomleft') {
		body.style.cursor = 'nesw-resize';
	} else if (dir == 'left') {
		body.style.cursor = 'ew-resize';
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
	time = new Date();
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

	hour = hour < 10 ? "0" + hour : hour;
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
// WELCOME
// ————————————————————————————————————————————————————————————

function generateWelcome(id) {
	let target = document.querySelector("#"+id);
	let targetContent = target.querySelector('.window-content');

	targetContent.innerHTML = `
		<div class="welcome-header">
			<div class="welcome-header-subtitle">Welcome to&nbsp;the</div>
			<div class="welcome-header-scale">
				<h4 class="welcome-header-rotate">
					Web Programming Workshop!
				</h4>
			</div>
		</div>
		<div class="welcome-links">
			<div data-color="blue" onclick="generateWindow('documents')" class="welcome-link">
				<svg viewBox="0 0 100 100"><polygon points="70 30 70 80 30 80 30 20 60 20 60 10 20 10 20 90 80 90 80 30 70 30"/><rect x="40" y="60" width="20" height="10"/><rect x="40" y="40" width="20" height="10"/><rect x="60" y="20" width="10" height="10"/></svg>
				<p>Taking (or teaching) a web programming course? Read through our <strong>documents</strong> to find the syllabus, schedules, and resources!</p>
			</div>
			<div data-color="purple" onclick="generateWindow('lessons')" class="welcome-link">
				<svg viewBox="0 0 100 100"><rect x="30" y="80" width="10" height="10"/><rect x="20" y="70" width="10" height="10"/><rect x="10" y="40" width="10" height="30"/><polygon points="40 40 40 50 60 50 60 40 50 40 50 20 40 20 40 30 20 30 20 40 40 40"/><rect x="50" y="10" width="20" height="10"/><rect x="60" y="30" width="20" height="10"/><rect x="80" y="40" width="10" height="30"/><rect x="70" y="70" width="10" height="10"/><rect x="40" y="70" width="20" height="10"/><rect x="60" y="80" width="10" height="10"/></svg>
				<p>Here to learn? Follow along with one of our <strong>lessons</strong> to learn something new!</p>
			</div>
			<div data-color="yellow" onclick="generateWindow('glossary')" class="welcome-link">
				<svg viewBox="0 0 100 100"><rect x="80" y="80" width="10" height="10"/><rect x="70" y="70" width="10" height="10"/><rect x="60" y="60" width="10" height="10"/><rect x="50" y="50" width="10" height="10"/><rect x="30" y="60" width="20" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="10" y="30" width="10" height="20"/><rect x="20" y="20" width="10" height="10"/><rect x="30" y="10" width="20" height="10"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="30" width="10" height="20"/></svg>
				<p>Looking for help? Reference our <strong>glossary</strong> when you’re feeling stuck!</p>
			</div>
			<div data-color="green" onclick="generateWindow('projects')" class="welcome-link">
				<svg viewBox="0 0 100 100"><polygon points="30 70 20 70 20 60 10 60 10 90 40 90 40 80 30 80 30 70"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="40" width="10" height="10"/><rect x="40" y="30" width="10" height="10"/><polygon points="80 30 80 20 70 20 70 10 60 10 60 20 50 20 50 30 60 30 60 40 70 40 70 50 80 50 80 40 90 40 90 30 80 30"/><rect x="60" y="50" width="10" height="10"/><rect x="50" y="60" width="10" height="10"/><rect x="40" y="70" width="10" height="10"/></svg>
				<p>Need a challenge? Pick one of our <strong>projects</strong> and see what you create!</p>
			</div>
			<div data-color="pink" onclick="generateWindow('code-editor')" class="welcome-link">
				<svg viewBox="0 0 100 100"><rect x="10" y="40" width="10" height="10"/><rect x="20" y="30" width="10" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="70" width="10" height="20"/><rect x="40" y="50" width="10" height="20"/><rect x="50" y="30" width="10" height="20"/><rect x="60" y="10" width="10" height="20"/><rect x="70" y="60" width="10" height="10"/><rect x="80" y="50" width="10" height="10"/><rect x="70" y="40" width="10" height="10"/></svg>
				<p>Itching to code? Get started in our <strong>code editor</strong> to test out your ideas!</p>
			</div>
		</div>
	`
}

// ————————————————————————————————————————————————————————————
// DOCUMENTS
// ————————————————————————————————————————————————————————————

function generateDocuments(id, source, section) {
	let target = document.querySelector("#"+id);
	target.dataset.catalog = 1;
	let targetContent = target.querySelector('.window-content');
	targetContent.dataset.nav = false;

	targetContent.innerHTML = `
		<div class="documents-catalog">
			<div data-doc="syllabus" class='documents-catalog-link' data-color='red'>
				<svg viewBox="0 0 100 100"><polygon points="70 30 70 80 30 80 30 20 60 20 60 10 20 10 20 90 80 90 80 30 70 30"/><rect x="40" y="60" width="20" height="10"/><rect x="40" y="40" width="20" height="10"/><rect x="60" y="20" width="10" height="10"/></svg>
				<div>
					<h4>Syllabus</h4>
					<p>Start here to learn all about the course!</p>
				</div>
			</div>
			<div data-doc="resources" class='documents-catalog-link' data-color='blue'>
				<svg viewBox="0 0 100 100"><path d="m50,30V10H10v80h80V30h-40Zm-30-10h20v10h-20v-10Zm60,60H20v-40h60v40Z"/></svg>
				<div>
					<h4>Resources</h4>
					<p>Additional resources for working with and learning code.</p>
				</div>
			</div>
			<div data-doc="4-week" class='documents-catalog-link' data-color='purple'>
				<svg viewBox="0 0 100 100"><path d="m10,10v80h80V10H10Zm70,70H20V20h60v60Z"/><polygon points="60 60 60 70 70 70 70 30 60 30 60 50 40 50 40 30 30 30 30 60 60 60"/></svg>
				<div>
					<h4>4-week Workshop Curriculum</h4>
					<p>A shortened version of the course, designed as a basic introduction to web programming concepts.</p>
				</div>
			</div>
			<div data-doc="5-week" class='documents-catalog-link' data-color='yellow'>
				<svg viewBox="0 0 100 100"><path d="m10,10v80h80V10H10Zm70,70H20V20h60v60Z"/><polygon points="70 40 70 30 30 30 30 50 50 50 50 40 70 40"/><polygon points="70 70 70 50 50 50 50 60 30 60 30 70 70 70"/></svg>
				<div>
					<h4>5-week Intensive Curriculum</h4>
					<p>The (mostly) full curriculum, cramming 12 meetings into 5 weeks.</p>
				</div>
			</div>
			<div data-doc="12-week" class='documents-catalog-link' data-color='green'>
				<svg viewBox="0 0 100 100"><path d="m10,10v80h80V10H10Zm70,70H20V20h60v60Z"/><rect x="30" y="30" width="10" height="40"/><polygon points="70 30 50 30 50 40 60 40 60 50 70 50 70 30"/><polygon points="70 70 70 60 60 60 60 50 50 50 50 70 70 70"/></svg>
				<div>
					<h4>12-week Semester Curriculum</h4>
					<p>The full curriculum at its normal pace.</p>
				</div>
			</div>
		</div>
		<div class="documents-content"></div>
	`
	let documentsCatalog = targetContent.querySelector('.documents-catalog');
	let documentsContent = targetContent.querySelector('.documents-content');

	// Add event listeners to menu items
	for (let link of documentsCatalog.querySelectorAll('.documents-catalog-link')) {
		link.addEventListener('click', () => {
			fetchDocument(link.dataset.doc);
		})
	}

	async function fetchDocument(source, section) {
		const response = await fetch(`sources/documents/${source}.html`);
		const data = await response.text();

		documentsContent.innerHTML = data;

		// Hide catalog menu
		target.dataset.catalog = 0;
		catalogState = false;

		// Add return button
		let docNav = targetContent.querySelector('.doc-nav');
		let docReturn = document.createElement('div');
		docReturn.classList.add('doc-return');
		docReturn.innerHTML = `
			<button class="doc-return-catalog">
				<svg viewBox="0 0 100 100"><rect x="10" y="10" width="20" height="20"/><rect x="40" y="10" width="20" height="20"/><rect x="70" y="10" width="20" height="20"/><rect x="10" y="40" width="20" height="20"/><rect x="40" y="40" width="20" height="20"/><rect x="70" y="40" width="20" height="20"/><rect x="10" y="70" width="20" height="20"/><rect x="40" y="70" width="20" height="20"/><rect x="70" y="70" width="20" height="20"/></svg>
				<span>Menu</span>
			</button>
			<button class="doc-return-share">
				<svg viewBox="0 0 100 100"><rect x="20" y="80" width="20" height="10"/><rect x="10" y="60" width="10" height="20"/><rect x="20" y="50" width="10" height="10"/><rect x="50" y="50" width="10" height="20"/><rect x="40" y="70" width="10" height="10"/><rect x="40" y="30" width="10" height="20"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="10" width="20" height="10"/><rect x="80" y="20" width="10" height="20"/><rect x="70" y="40" width="10" height="10"/></svg>
				<span>Copy&nbsp;URL</span>
			</button>
			<button class="doc-return-close">
				<svg viewBox="0 0 100 100"><polygon points="10 90 10 80 80 80 80 40 40 40 40 60 30 60 30 50 20 50 20 40 10 40 10 30 20 30 20 20 30 20 30 10 40 10 40 30 90 30 90 90 10 90"/></svg>
				<span>Return</span>
			</button>
		`;
		let docReturnCatalog = docReturn.querySelector('.doc-return-catalog');
		docReturnCatalog.addEventListener('click', openCatalog);
		let docReturnShare = docReturn.querySelector('.doc-return-share');
		docReturnShare.addEventListener('click', () => {copyURL([['document',source]])});
		let docReturnClose = docReturn.querySelector('.doc-return-close');
		docReturnClose.addEventListener('click', toggleNav);
		docNav.appendChild(docReturn);

		// Add event listeners to navigation
		let docNavLogo = docNav.querySelector('h4');
		docNavLogo.addEventListener('click', () => {scrollToSection('header')});
		docNavLogo.addEventListener('click', navClose);

		let docNavLinks = docNav.querySelectorAll('[data-section]');
		for (let docNavLink of docNavLinks) {
			docNavLink.addEventListener('click', () => {scrollToSection(docNavLink.dataset.section)});
			docNavLink.addEventListener('click', navClose);
		}

		// Add share icons to titles and copyURL event listeners
		let docContent = targetContent.querySelector('.doc-content');
		for (let sectionLink of docContent.querySelectorAll('[data-link]')) {
			sectionLink.innerHTML += `<svg viewBox="0 0 100 100"><rect x="20" y="80" width="20" height="10"/><rect x="10" y="60" width="10" height="20"/><rect x="20" y="50" width="10" height="10"/><rect x="50" y="50" width="10" height="20"/><rect x="40" y="70" width="10" height="10"/><rect x="40" y="30" width="10" height="20"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="10" width="20" height="10"/><rect x="80" y="20" width="10" height="20"/><rect x="70" y="40" width="10" height="10"/></svg>`;
			sectionLink.addEventListener('click', () => copyURL([['document',source],['section',sectionLink.dataset.link]]));
		}

		// Add app icons to buttons
		for (let btn of docContent.querySelectorAll(`button[data-color='red']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="40" y="30" width="10" height="20"/><rect x="50" y="10" width="10" height="20"/><rect x="10" y="10" width="10" height="20"/><rect x="30" y="10" width="10" height="20"/><rect x="20" y="30" width="10" height="20"/><polygon points="60 70 60 60 80 60 80 50 50 50 50 90 60 90 60 80 80 80 80 70 60 70"/><rect x="80" y="60" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of docContent.querySelectorAll(`button[data-color='blue']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><polygon points="70 30 70 80 30 80 30 20 60 20 60 10 20 10 20 90 80 90 80 30 70 30"/><rect x="40" y="60" width="20" height="10"/><rect x="40" y="40" width="20" height="10"/><rect x="60" y="20" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of docContent.querySelectorAll(`button[data-color='purple']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="30" y="80" width="10" height="10"/><rect x="20" y="70" width="10" height="10"/><rect x="10" y="40" width="10" height="30"/><polygon points="40 40 40 50 60 50 60 40 50 40 50 20 40 20 40 30 20 30 20 40 40 40"/><rect x="50" y="10" width="20" height="10"/><rect x="60" y="30" width="20" height="10"/><rect x="80" y="40" width="10" height="30"/><rect x="70" y="70" width="10" height="10"/><rect x="40" y="70" width="20" height="10"/><rect x="60" y="80" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of docContent.querySelectorAll(`button[data-color='yellow']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="80" y="80" width="10" height="10"/><rect x="70" y="70" width="10" height="10"/><rect x="60" y="60" width="10" height="10"/><rect x="50" y="50" width="10" height="10"/><rect x="30" y="60" width="20" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="10" y="30" width="10" height="20"/><rect x="20" y="20" width="10" height="10"/><rect x="30" y="10" width="20" height="10"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="30" width="10" height="20"/></svg>` + btn.innerHTML;
		}
		for (let btn of docContent.querySelectorAll(`button[data-color='green']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><polygon points="30 70 20 70 20 60 10 60 10 90 40 90 40 80 30 80 30 70"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="40" width="10" height="10"/><rect x="40" y="30" width="10" height="10"/><polygon points="80 30 80 20 70 20 70 10 60 10 60 20 50 20 50 30 60 30 60 40 70 40 70 50 80 50 80 40 90 40 90 30 80 30"/><rect x="60" y="50" width="10" height="10"/><rect x="50" y="60" width="10" height="10"/><rect x="40" y="70" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of docContent.querySelectorAll(`button[data-color='pink']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="10" y="40" width="10" height="10"/><rect x="20" y="30" width="10" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="70" width="10" height="20"/><rect x="40" y="50" width="10" height="20"/><rect x="50" y="30" width="10" height="20"/><rect x="60" y="10" width="10" height="20"/><rect x="70" y="60" width="10" height="10"/><rect x="80" y="50" width="10" height="10"/><rect x="70" y="40" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of docContent.querySelectorAll(`button`)) {
			if (btn.dataset.color == undefined) {
				btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="20" y="80" width="20" height="10"/><rect x="10" y="60" width="10" height="20"/><rect x="20" y="50" width="10" height="10"/><rect x="50" y="50" width="10" height="20"/><rect x="40" y="70" width="10" height="10"/><rect x="40" y="30" width="10" height="20"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="10" width="20" height="10"/><rect x="80" y="20" width="10" height="20"/><rect x="70" y="40" width="10" height="10"/></svg>` + btn.innerHTML;
			}
		}

		// Create table of contents toggle
		let docToc = document.createElement('div');
		docToc.classList.add('doc-toc');
		docToc.innerHTML = `
			<button>
				<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="20"/><rect x="10" y="40" width="80" height="20"/><rect x="10" y="70" width="80" height="20"/></svg>
				<span>Table of Contents</span>
			</button>
		`;
		documentsContent.appendChild(docToc);
		docToc.addEventListener('click', toggleNav);

		// Scroll to section if defined
		if (section != undefined) {
			setTimeout(() => {
				scrollToSection(section);
			}, 500)
		}
	}

	function scrollToSection(section) {
		let docContent = targetContent.querySelector('.doc-content');
		let targetSection = docContent.querySelector(`[data-id="${section}"]`);
		// delay scrolling on mobile
		if (target.dataset.responsive == "2") {
			setTimeout(() => {
				docContent.scrollTo({top: targetSection.offsetTop - 60, behavior: 'smooth'})
			}, 150);
		} else {
			docContent.scrollTo({top: targetSection.offsetTop - 60, behavior: 'smooth'});
		}
	}

	// Toggle table of contents
	let navState = false;
	function toggleNav() {
		navState = !navState;
		targetContent.dataset.nav = navState;
	}
	function navClose() {
		navState = false;
		targetContent.dataset.nav = navState;
	}

	// Open catalog
	let catalogState = true;
	function openCatalog() {
		catalogState = true;
		target.dataset.catalog = 1;
	}

	// Open document on load if specified
	if (source != undefined) {
		fetchDocument(source, section)
	}
}

// ————————————————————————————————————————————————————————————
// LESSONS
// ————————————————————————————————————————————————————————————

function generateLessons(id, source) {
	let target = document.querySelector("#"+id);
	let targetContent = target.querySelector('.window-content');
	let activeLesson, activeIndex;
	let initialize = true;

	targetContent.innerHTML = `
		<div class="lesson-catalog"></div>
		<div class="lesson-content"></div>
	`
	let lessonCatalog = targetContent.querySelector('.lesson-catalog');
	let lessonContent = targetContent.querySelector('.lesson-content');

	// Populate catalog
	let lessonsBackup;
	async function fetchCatalog() {
		const response = await fetch("sources/lessons.json");
		const data = await response.json();
		lessonsBackup = data;

		let temp = '';
		for (let index of Object.keys(lessonsBackup)) {
			let entry = lessonsBackup[index];

			if (entry['active'] == 0) {
				continue
			}

			// Generate difficulty rating
			let color = 'red';
			if (entry['difficulty'] == 2) {
				color = 'blue';
			} else if (entry['difficulty'] == 3) {
				color = 'purple';
			} else if (entry['difficulty'] == 4) {
				color = 'yellow';
			} else if (entry['difficulty'] == 5) {
				color = 'green';
			} else if (entry['difficulty'] == 6) {
				color = 'pink';
			}
			let difficulty = `<div class='lesson-catalog-difficulty-rating'>`;
			for (let i=1; i<7; i++) {
				if (i<entry['difficulty']+1) {
					difficulty += `<div data-active="1"></div>`;
				} else {
					difficulty += `<div></div>`;
				}
			}
			difficulty += '</div>';

			// Generate outcomes
			let outcomesString = entry['outcomes'].split(',');
			let outcomes = '';
			for (let i of outcomesString) {
				outcomes += `<li>${i.trimStart()}</li>`;
			}

			// Generate lesson number (if applicable)
			let number = entry['number'];
			if (number != "") {
				number = `<span>${number}</span>`;
			}

			temp += `
				<div class="lesson-catalog-link" data-index="${index}" data-color="${color}">
					<div class="lesson-catalog-info">
						<h4>
							<span class="lesson-catalog-subtitle">${entry['type']}${number}</span>
							<span  class="lesson-catalog-title">${entry['name']}</span>
						</h4>
						<p class="lesson-catalog-summary">
							${entry['summary']}
						</p>
						<div class="lesson-catalog-outcomes">
							<h5>Outcomes</h5>
							<ul>
								${outcomes}
							</ul>
						</div>
					</div>
					<div class="lesson-catalog-difficulty">
						<h5>Difficulty</h5>
						${difficulty}
					</div>
				</div>
			`
		}
		lessonCatalog.innerHTML = temp;
		for (let catalogLink of target.querySelectorAll('.lesson-catalog-link')) {
			let index = catalogLink.dataset.index;
			let source = lessonsBackup[index]['source'];
			catalogLink.addEventListener('click', () => {
				openLesson(source);
			});
		}

		// Get source file if specified
		if (source != undefined) {
			target.dataset.menu = 0;
			openLesson(source);
		} else {
			target.dataset.menu = 1;
		}
	}
	fetchCatalog();

	// Fetch source and generate lesson
	let sourceBackup;
	async function fetchSource(source) {
		const response = await fetch("sources/lessons/"+source);
		const data = await response.text();
		sourceBackup = data;

		populateContent(source);
	}

	// Populate lesson content
	function populateContent(source) {
		activeIndex = findByProperty(lessonsBackup, 'source', source);
		let entry = lessonsBackup[activeIndex];

		// Generate rating color and dots
		let color = 'red';
		if (entry['difficulty'] == 2) {
			color = 'blue';
		} else if (entry['difficulty'] == 3) {
			color = 'purple';
		} else if (entry['difficulty'] == 4) {
			color = 'yellow';
		} else if (entry['difficulty'] == 5) {
			color = 'green';
		} else if (entry['difficulty'] == 6) {
			color = 'pink';
		}
		lessonContent.dataset.color = color;

		let headerRating = '';
		for (let i=1; i<7; i++) {
			if (i<entry['difficulty']+1) {
				headerRating += `<div data-active="1"></div>`;
			} else {
				headerRating += `<div></div>`;
			}
		}

		// Generate header tags
		let lessonConcepts = entry['concepts'].split(',');
		let headerConcepts = '';
		if (lessonConcepts != '') {
			headerConcepts += '<div><h5>Concepts</h5><ul data-color="yellow">';
			for (let i of lessonConcepts) {
				headerConcepts += `<li onclick="generateWindow('glossary', '${i.trimStart()}')">${i.trimStart()}</li>`;
			}
			headerConcepts += '</ul></div>';
		}

		let lessonHTML = entry['html'].split(',');
		let headerHTML = '';
		if (lessonHTML != '') {
			headerHTML += '<div><h5>HTML</h5><ul data-color="yellow">';
			for (let i of lessonHTML) {
				headerHTML += `<li onclick="generateWindow('glossary', '${i.trimStart()}')">${i.trimStart()}</li>`;
			}
			headerHTML += '</ul></div>';
		}

		let lessonCSS = entry['css'].split(',');
		let headerCSS = '';
		if (lessonCSS != '') {
			headerCSS += '<div><h5>CSS</h5><ul data-color="yellow">';
			for (let i of lessonCSS) {
				headerCSS += `<li onclick="generateWindow('glossary', '${i.trimStart()}')">${i.trimStart()}</li>`;
			}
			headerCSS += '</ul></div>';
		}

		let lessonJS = entry['javascript'].split(',');
		let headerJS = '';
		if (lessonJS != '') {
			headerJS += '<div><h5>JavaScript</h5><ul data-color="yellow">';
			for (let i of lessonJS) {
				headerJS += `<li onclick="generateWindow('glossary', '${i.trimStart()}')">${i.trimStart()}</li>`;
			}
			headerJS += '</ul></div>';
		}

		let lessonMisc = entry['misc'].split(',');
		let headerMisc = '';
		if (lessonMisc != '') {
			headerMisc += '<div><h5>Misc</h5><ul data-color="yellow">';
			for (let i of lessonMisc) {
				headerMisc += `<li onclick="generateWindow('glossary', '${i.trimStart()}')">${i.trimStart()}</li>`;
			}
			headerMisc += '</ul></div>';
		}

		// Header number
		let headerNumber = entry['number'];
		if (headerNumber != "") {
			headerNumber = `<span>${headerNumber}</span>`;
		}

		let header = `
			<header>
				<h4>
					<span class="lesson-doc-subtitle">${entry['type']}${headerNumber}</span>
					<span class="lesson-doc-title">
						<span class="lesson-doc-title-name">${entry['name']}</span>
					</span>
				</h4>

				<p>${entry['summary']}</p>

				<div class="lesson-doc-difficulty">
					<h5>Difficulty</h5>
					<div class="lesson-doc-difficulty-rating">
						${headerRating}
					</div>
				</div>

				<div class="lesson-doc-divider"></div>

				<div class="lesson-doc-concepts">
					${headerConcepts}
					${headerHTML}
					${headerCSS}
					${headerJS}
					${headerMisc}
				</div>
			</header>
		`

		lessonContent.innerHTML = `
			<div class="lesson-doc" data-color="${'blue'}">
				${header}
				${sourceBackup}
			</div>
		`;

		// Add navigation
		lessonContent.innerHTML += `
			<div class="lesson-content-nav">
				<button class='lesson-content-nav-catalog'>
					<svg viewBox="0 0 100 100"><rect x="10" y="10" width="20" height="20"/><rect x="40" y="10" width="20" height="20"/><rect x="70" y="10" width="20" height="20"/><rect x="10" y="40" width="20" height="20"/><rect x="40" y="40" width="20" height="20"/><rect x="70" y="40" width="20" height="20"/><rect x="10" y="70" width="20" height="20"/><rect x="40" y="70" width="20" height="20"/><rect x="70" y="70" width="20" height="20"/></svg>
					<span>View All Lessons</span>
				</button>
				<button class='lesson-content-nav-prev'>
					<svg viewBox="0 0 100 100"><polygon points="50 40 50 15 40 15 40 25 30 25 30 35 20 35 20 45 10 45 10 55 20 55 20 65 30 65 30 75 40 75 40 85 50 85 50 60 90 60 90 40 50 40"/></svg>
					<span>Previous Lesson</span>
				</button>
				<button class='lesson-content-nav-next'>
				<svg viewBox="0 0 100 100"><polygon points="50 40 50 15 60 15 60 25 70 25 70 35 80 35 80 45 90 45 90 55 80 55 80 65 70 65 70 75 60 75 60 85 50 85 50 60 10 60 10 40 50 40"/></svg>
					<span>Next Lesson</span>
				</button>
			</div>
		`
		let navPrev = target.querySelector('.lesson-content-nav-prev');
		navPrev.addEventListener('click', prevLesson);
		let navCatalog = target.querySelector('.lesson-content-nav-catalog');
		navCatalog.addEventListener('click', openCatalog);
		let navNext = target.querySelector('.lesson-content-nav-next');
		navNext.addEventListener('click', nextLesson);

		// Add share icons to titles and copyURL event listeners
		let lessonTitle = lessonContent.querySelector('.lesson-doc-title');
		lessonTitle.innerHTML += `<svg viewBox="0 0 100 100"><rect x="20" y="80" width="20" height="10"/><rect x="10" y="60" width="10" height="20"/><rect x="20" y="50" width="10" height="10"/><rect x="50" y="50" width="10" height="20"/><rect x="40" y="70" width="10" height="10"/><rect x="40" y="30" width="10" height="20"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="10" width="20" height="10"/><rect x="80" y="20" width="10" height="20"/><rect x="70" y="40" width="10" height="10"/></svg>`;
		lessonTitle.addEventListener('click', () => copyURL([['lesson',activeLesson]]))
		for (let section of lessonContent.querySelectorAll('.lesson-doc section')) {
			let sectionTitle = section.querySelector('h5');
			sectionTitle.innerHTML += `<svg viewBox="0 0 100 100"><rect x="20" y="80" width="20" height="10"/><rect x="10" y="60" width="10" height="20"/><rect x="20" y="50" width="10" height="10"/><rect x="50" y="50" width="10" height="20"/><rect x="40" y="70" width="10" height="10"/><rect x="40" y="30" width="10" height="20"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="10" width="20" height="10"/><rect x="80" y="20" width="10" height="20"/><rect x="70" y="40" width="10" height="10"/></svg>`;
			sectionTitle.addEventListener('click', () => copyURL([['lesson',activeLesson], ['section',section.id]]));
		}

		// Add app icons to buttons
		for (let btn of lessonContent.querySelectorAll(`.lesson-doc section button[data-color='red']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="40" y="30" width="10" height="20"/><rect x="50" y="10" width="10" height="20"/><rect x="10" y="10" width="10" height="20"/><rect x="30" y="10" width="10" height="20"/><rect x="20" y="30" width="10" height="20"/><polygon points="60 70 60 60 80 60 80 50 50 50 50 90 60 90 60 80 80 80 80 70 60 70"/><rect x="80" y="60" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of lessonContent.querySelectorAll(`.lesson-doc section button[data-color='blue']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><polygon points="70 30 70 80 30 80 30 20 60 20 60 10 20 10 20 90 80 90 80 30 70 30"/><rect x="40" y="60" width="20" height="10"/><rect x="40" y="40" width="20" height="10"/><rect x="60" y="20" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of lessonContent.querySelectorAll(`.lesson-doc section button[data-color='purple']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="30" y="80" width="10" height="10"/><rect x="20" y="70" width="10" height="10"/><rect x="10" y="40" width="10" height="30"/><polygon points="40 40 40 50 60 50 60 40 50 40 50 20 40 20 40 30 20 30 20 40 40 40"/><rect x="50" y="10" width="20" height="10"/><rect x="60" y="30" width="20" height="10"/><rect x="80" y="40" width="10" height="30"/><rect x="70" y="70" width="10" height="10"/><rect x="40" y="70" width="20" height="10"/><rect x="60" y="80" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of lessonContent.querySelectorAll(`.lesson-doc section button[data-color='yellow']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="80" y="80" width="10" height="10"/><rect x="70" y="70" width="10" height="10"/><rect x="60" y="60" width="10" height="10"/><rect x="50" y="50" width="10" height="10"/><rect x="30" y="60" width="20" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="10" y="30" width="10" height="20"/><rect x="20" y="20" width="10" height="10"/><rect x="30" y="10" width="20" height="10"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="30" width="10" height="20"/></svg>` + btn.innerHTML;
		}
		for (let btn of lessonContent.querySelectorAll(`.lesson-doc section button[data-color='green']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><polygon points="30 70 20 70 20 60 10 60 10 90 40 90 40 80 30 80 30 70"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="40" width="10" height="10"/><rect x="40" y="30" width="10" height="10"/><polygon points="80 30 80 20 70 20 70 10 60 10 60 20 50 20 50 30 60 30 60 40 70 40 70 50 80 50 80 40 90 40 90 30 80 30"/><rect x="60" y="50" width="10" height="10"/><rect x="50" y="60" width="10" height="10"/><rect x="40" y="70" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of lessonContent.querySelectorAll(`.lesson-doc section button[data-color='pink']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="10" y="40" width="10" height="10"/><rect x="20" y="30" width="10" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="70" width="10" height="20"/><rect x="40" y="50" width="10" height="20"/><rect x="50" y="30" width="10" height="20"/><rect x="60" y="10" width="10" height="20"/><rect x="70" y="60" width="10" height="10"/><rect x="80" y="50" width="10" height="10"/><rect x="70" y="40" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of lessonContent.querySelectorAll(`.lesson-doc section button`)) {
			if (btn.dataset.color == undefined) {
				btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="20" y="80" width="20" height="10"/><rect x="10" y="60" width="10" height="20"/><rect x="20" y="50" width="10" height="10"/><rect x="50" y="50" width="10" height="20"/><rect x="40" y="70" width="10" height="10"/><rect x="40" y="30" width="10" height="20"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="10" width="20" height="10"/><rect x="80" y="20" width="10" height="20"/><rect x="70" y="40" width="10" height="10"/></svg>` + btn.innerHTML;
			}
		}

		// Jump to section on initial load
		if (initialize == true) {
			let url = new URL(window.location.href);
			let params = new URLSearchParams(url.search);
			if (params.has('section')) {
				setTimeout(() => {
					jumpToSection(params.get('section'));
				}, 500);
			}
			initialize = false;
		}

		target.dataset.menu = 0;
	}

	function jumpToSection(section) {
		let anchor = lessonContent.querySelector('#' + section);
		anchor.scrollIntoView({
			behavior: 'smooth',
			block: "start",
		});
	}

	// Lesson traversal
	function openLesson(source) {
		activeLesson = source.split('.')[0];
		fetchSource(source);
	}
	function openCatalog() {
		target.dataset.menu = 1;
	}
	function prevLesson() {
		activeIndex--;
		if (activeIndex < 0) {
			activeIndex = lessonsBackup.length-1;
		}
		if (lessonsBackup[activeIndex]['active'] == 0) {
			prevLesson();
		} else {
			openLesson(lessonsBackup[activeIndex]['source']);
		}
	}
	function nextLesson() {
		activeIndex++;
		if (activeIndex >= lessonsBackup.length) {
			activeIndex = 0;
		}
		if (lessonsBackup[activeIndex]['active'] == 0) {
			nextLesson();
		} else {
			openLesson(lessonsBackup[activeIndex]['source']);
		}
	}
}

// ————————————————————————————————————————————————————————————
// GLOSSARY
// ————————————————————————————————————————————————————————————

function generateGlossary(id, source) {
	let target = document.querySelector("#"+id);
	let targetContent = target.querySelector('.window-content');

	targetContent.innerHTML = `
		<div class="glossary-menu">
			<div class="glossary-search">
				<input type="text" placeholder="Search for Terms">
			</div>
		</div>
		<div class="glossary-content"></div>
	`

	let glossaryMenu = targetContent.querySelector('.glossary-menu');
	let glossaryContent = targetContent.querySelector('.glossary-content');
	let activeGlossary = 'index.html';

	let glossaryBackup;
	async function fetchMenu() {
		const response = await fetch("sources/glossary.json");
		const data = await response.json();
		glossaryBackup = data;

		let temp = '';
		for (let index of Object.keys(glossaryBackup)) {
			let entry = glossaryBackup[index];

			if (entry['active'] == 0) {
				continue
			}

			let color = 'red';
			if (entry['type'] == 'html') {
				color = 'blue';
			} else if (entry['type'] == 'css') {
				color = 'purple';
			} else if (entry['type'] == 'javascript') {
				color = 'yellow';
			} else if (entry['type'] == 'misc') {
				color = 'green';
			}

			temp += `
				<div class="glossary-term" data-index="${index}" data-term="${entry['term']}" data-color="${color}">
					<div class="glossary-term-type">${entry['type']}</div>
					<div class="glossary-term-name">${entry['term']}</div>
					<div class="glossary-term-desc">${entry['desc']}</div>
				</div>
			`
		}
		glossaryMenu.innerHTML += temp + `
			<div class="glossary-return">
				<button class="glossary-return-btn">
					<svg viewBox="0 0 100 100"><polygon points="10 90 10 80 80 80 80 40 40 40 40 60 30 60 30 50 20 50 20 40 10 40 10 30 20 30 20 20 30 20 30 10 40 10 40 30 90 30 90 90 10 90"/></svg>
					<span>Return</span>
				</button>
			</div>
		`;

		// Close nav event listeners
		let glossaryReturn = glossaryMenu.querySelector('.glossary-return-btn');
		glossaryReturn.addEventListener('click', closeNav);
		for (let term of targetContent.querySelectorAll('.glossary-term')) {
			term.addEventListener('click', toggleNav);
		}

		for (let term of glossaryMenu.querySelectorAll('.glossary-term')) {
			let index = term.dataset.index;
			let source = glossaryBackup[index]['source'];
			term.addEventListener('click', () => {
				fetchTerm(source);
			});
		}

		// Search event listener
		let glossarySearch = glossaryMenu.querySelector('.glossary-search input');
		glossarySearch.addEventListener('input', () => {
			setSearch(glossarySearch.value);
		})

		// Get source file if specified
		console.log(source);
		if (source != undefined) {
			target.dataset.menu = 0;
			// Get correct source if .html is not included
			if (!source.includes('.html')) {
				source = glossaryBackup[findByProperty(glossaryBackup, 'term', source)]['source'];
			}
		} else {
			activeGlossary = glossaryBackup[0]['term'];
			source = glossaryBackup[0]['source'];
			target.dataset.menu = 1;
		}
		console.log(source);
		fetchTerm(source);
	}
	fetchMenu();

	// Fetch source and generate lesson
	let sourceBackup;
	async function fetchTerm(source) {
		const response = await fetch("sources/glossary/"+source);
		const data = await response.text();
		sourceBackup = data;
		activeGlossary = source.split('.')[0];
		let key = findByProperty(glossaryBackup, 'source', source);

		// Generate header
		let header = `
			<header>
				<div class="glossary-content-type">${glossaryBackup[key]['type']}</div>
				<h4 class="glossary-content-name"><span>${glossaryBackup[key]['term']}</span></h4>
				<p class="glossary-content-desc">${glossaryBackup[key]['desc']}</p>
			</header>
		`;

		glossaryContent.innerHTML = header + data;

		// Set color
		let type = glossaryBackup[key]['type'];
		let color = 'red';
		if (type == 'html') {
			color = 'blue';
		} else if (type == 'css') {
			color = 'purple';
		} else if (type == 'javascript') {
			color = 'yellow';
		} else if (type == 'misc') {
			color = 'green';
		}
		glossaryContent.dataset.color = color;

		// Add share icon to title and copyURL event listener
		let glossaryName = glossaryContent.querySelector('.glossary-content-name');
		glossaryName.innerHTML += `<svg viewBox="0 0 100 100"><rect x="20" y="80" width="20" height="10"/><rect x="10" y="60" width="10" height="20"/><rect x="20" y="50" width="10" height="10"/><rect x="50" y="50" width="10" height="20"/><rect x="40" y="70" width="10" height="10"/><rect x="40" y="30" width="10" height="20"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="10" width="20" height="10"/><rect x="80" y="20" width="10" height="20"/><rect x="70" y="40" width="10" height="10"/></svg>`;
		glossaryName.addEventListener('click', () => copyURL([['glossary',activeGlossary]]))

		// Add app icons to buttons
		for (let btn of glossaryContent.querySelectorAll(`button[data-color='red']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="40" y="30" width="10" height="20"/><rect x="50" y="10" width="10" height="20"/><rect x="10" y="10" width="10" height="20"/><rect x="30" y="10" width="10" height="20"/><rect x="20" y="30" width="10" height="20"/><polygon points="60 70 60 60 80 60 80 50 50 50 50 90 60 90 60 80 80 80 80 70 60 70"/><rect x="80" y="60" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of glossaryContent.querySelectorAll(`button[data-color='blue']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><polygon points="70 30 70 80 30 80 30 20 60 20 60 10 20 10 20 90 80 90 80 30 70 30"/><rect x="40" y="60" width="20" height="10"/><rect x="40" y="40" width="20" height="10"/><rect x="60" y="20" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of glossaryContent.querySelectorAll(`button[data-color='purple']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="30" y="80" width="10" height="10"/><rect x="20" y="70" width="10" height="10"/><rect x="10" y="40" width="10" height="30"/><polygon points="40 40 40 50 60 50 60 40 50 40 50 20 40 20 40 30 20 30 20 40 40 40"/><rect x="50" y="10" width="20" height="10"/><rect x="60" y="30" width="20" height="10"/><rect x="80" y="40" width="10" height="30"/><rect x="70" y="70" width="10" height="10"/><rect x="40" y="70" width="20" height="10"/><rect x="60" y="80" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of glossaryContent.querySelectorAll(`button[data-color='yellow']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="80" y="80" width="10" height="10"/><rect x="70" y="70" width="10" height="10"/><rect x="60" y="60" width="10" height="10"/><rect x="50" y="50" width="10" height="10"/><rect x="30" y="60" width="20" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="10" y="30" width="10" height="20"/><rect x="20" y="20" width="10" height="10"/><rect x="30" y="10" width="20" height="10"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="30" width="10" height="20"/></svg>` + btn.innerHTML;
		}
		for (let btn of glossaryContent.querySelectorAll(`button[data-color='green']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><polygon points="30 70 20 70 20 60 10 60 10 90 40 90 40 80 30 80 30 70"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="40" width="10" height="10"/><rect x="40" y="30" width="10" height="10"/><polygon points="80 30 80 20 70 20 70 10 60 10 60 20 50 20 50 30 60 30 60 40 70 40 70 50 80 50 80 40 90 40 90 30 80 30"/><rect x="60" y="50" width="10" height="10"/><rect x="50" y="60" width="10" height="10"/><rect x="40" y="70" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of glossaryContent.querySelectorAll(`button[data-color='pink']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="10" y="40" width="10" height="10"/><rect x="20" y="30" width="10" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="70" width="10" height="20"/><rect x="40" y="50" width="10" height="20"/><rect x="50" y="30" width="10" height="20"/><rect x="60" y="10" width="10" height="20"/><rect x="70" y="60" width="10" height="10"/><rect x="80" y="50" width="10" height="10"/><rect x="70" y="40" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of glossaryContent.querySelectorAll(`button`)) {
			if (btn.dataset.color == undefined) {
				btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="20" y="80" width="20" height="10"/><rect x="10" y="60" width="10" height="20"/><rect x="20" y="50" width="10" height="10"/><rect x="50" y="50" width="10" height="20"/><rect x="40" y="70" width="10" height="10"/><rect x="40" y="30" width="10" height="20"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="10" width="20" height="10"/><rect x="80" y="20" width="10" height="20"/><rect x="70" y="40" width="10" height="10"/></svg>` + btn.innerHTML;
			}
		}
	}

	// Create menu toggle
	let glossaryMenuToggle = document.createElement('div');
	glossaryMenuToggle.classList.add('glossary-menu-toggle');
	glossaryMenuToggle.innerHTML = `
		<button>
			<svg viewBox="0 0 100 100"><rect x="10" y="10" width="80" height="20"/><rect x="10" y="40" width="80" height="20"/><rect x="10" y="70" width="80" height="20"/></svg>
			<span>Pick a Term</span>
		</button>
	`;
	targetContent.appendChild(glossaryMenuToggle);
	glossaryMenuToggle.addEventListener('click', toggleNav);

	// Toggle menu
	let navState = false;
	function toggleNav() {
		navState = !navState;
		targetContent.dataset.nav = navState;
	}
	function closeNav() {
		navState = false;
		targetContent.dataset.nav = navState;
	}

	// Search filter
	let searchString = "";
	function setSearch(query) {
		searchString = query;
		formattedInput = searchString.toLowerCase().replace(/[.,\/#!$%\^&*;:{}=\-_`~()‘’“”\?]/g,"");
		for (let term of glossaryMenu.querySelectorAll('.glossary-term')) {
			let index = term.dataset.index;
			let termType = glossaryBackup[index]['type'].toLowerCase().replace(/[.,\/#!$%\^&*;:{}=\-_`~()‘’“”\?]/g,"");
			let termName = glossaryBackup[index]['term'].toLowerCase().replace(/[.,\/#!$%\^&*;:{}=\-_`~()‘’“”\?]/g,"");
			let termDesc = glossaryBackup[index]['desc'].toLowerCase().replace(/[.,\/#!$%\^&*;:{}=\-_`~()‘’“”\?]/g,"");

			if (termType.includes(formattedInput) || termName.includes(formattedInput) || termDesc.includes(formattedInput)) {
				term.dataset.show = 1;
			} else {
				term.dataset.show = 0;
			}
		}
	}
}

// ————————————————————————————————————————————————————————————
// PROJECTS
// ————————————————————————————————————————————————————————————

function generateProjects(id, source) {
	let target = document.querySelector("#"+id);
	let targetContent = target.querySelector('.window-content');
	let activeProject, activeIndex;
	let initialize = true;

	targetContent.innerHTML = `
		<div class="project-catalog"></div>
		<div class="project-content"></div>
	`
	let projectCatalog = targetContent.querySelector('.project-catalog');
	let projectContent = targetContent.querySelector('.project-content');

	// Populate catalog
	let projectsBackup;
	async function fetchCatalog() {
		const response = await fetch("sources/projects.json");
		const data = await response.json();
		projectsBackup = data;

		let temp = '';
		for (let index of Object.keys(projectsBackup)) {
			let entry = projectsBackup[index];

			if (entry['active'] == 0) {
				continue
			}

			// Generate difficulty rating
			let color = 'red';
			if (entry['difficulty'] == 2) {
				color = 'blue';
			} else if (entry['difficulty'] == 3) {
				color = 'purple';
			} else if (entry['difficulty'] == 4) {
				color = 'yellow';
			} else if (entry['difficulty'] == 5) {
				color = 'green';
			} else if (entry['difficulty'] == 6) {
				color = 'pink';
			}
			let difficulty = `<div class='project-catalog-difficulty-rating'>`;
			for (let i=1; i<7; i++) {
				if (i<entry['difficulty']+1) {
					difficulty += `<div data-active="1"></div>`;
				} else {
					difficulty += `<div></div>`;
				}
			}
			difficulty += '</div>';

			// Generate outcomes
			let outcomesString = entry['outcomes'].split(',');
			let outcomes = '';
			for (let i of outcomesString) {
				outcomes += `<li>${i.trimStart()}</li>`;
			}

			// Generate project number (if applicable)
			let number = entry['number'];
			if (number != "") {
				number = `<span>${number}</span>`;
			}

			temp += `
				<div class="project-catalog-link" data-index="${index}" data-color="${color}">
					<div class="project-catalog-info">
						<h4>
							<span class="project-catalog-subtitle">${entry['type']}${number}</span>
							<span  class="project-catalog-title">${entry['name']}</span>
						</h4>
						<p class="project-catalog-summary">
							${entry['summary']}
						</p>
						<div class="project-catalog-outcomes">
							<h5>Outcomes</h5>
							<ul>
								${outcomes}
							</ul>
						</div>
					</div>
					<div class="project-catalog-difficulty">
						<h5>Difficulty</h5>
						${difficulty}
					</div>
				</div>
			`
		}
		projectCatalog.innerHTML = temp;
		for (let catalogLink of target.querySelectorAll('.project-catalog-link')) {
			let index = catalogLink.dataset.index;
			let source = projectsBackup[index]['source'];
			catalogLink.addEventListener('click', () => {
				openProject(source);
			});
		}

		// Get source file if specified
		if (source != undefined) {
			target.dataset.menu = 0;
			openProject(source);
		} else {
			target.dataset.menu = 1;
		}
	}
	fetchCatalog();

	// Fetch source and generate project
	let sourceBackup;
	async function fetchSource(source) {
		const response = await fetch("sources/projects/"+source);
		const data = await response.text();
		sourceBackup = data;

		populateContent(source);
	}

	// Populate project content
	function populateContent(source) {
		activeIndex = findByProperty(projectsBackup, 'source', source);
		let entry = projectsBackup[activeIndex];

		// Generate rating color and dots
		let color = 'red';
		if (entry['difficulty'] == 2) {
			color = 'blue';
		} else if (entry['difficulty'] == 3) {
			color = 'purple';
		} else if (entry['difficulty'] == 4) {
			color = 'yellow';
		} else if (entry['difficulty'] == 5) {
			color = 'green';
		} else if (entry['difficulty'] == 6) {
			color = 'pink';
		}
		projectContent.dataset.color = color;

		let headerRating = '';
		for (let i=1; i<7; i++) {
			if (i<entry['difficulty']+1) {
				headerRating += `<div data-active="1"></div>`;
			} else {
				headerRating += `<div></div>`;
			}
		}

		// Generate header tags
		let projectConcepts = entry['concepts'].split(',');
		let headerConcepts = '';
		if (projectConcepts != '') {
			headerConcepts += '<div><h5>Concepts</h5><ul data-color="yellow">';
			for (let i of projectConcepts) {
				headerConcepts += `<li onclick="generateWindow('glossary', '${i.trimStart()}')">${i.trimStart()}</li>`;
			}
			headerConcepts += '</ul></div>';
		}

		let projectHTML = entry['html'].split(',');
		let headerHTML = '';
		if (projectHTML != '') {
			headerHTML += '<div><h5>HTML</h5><ul data-color="yellow">';
			for (let i of projectHTML) {
				headerHTML += `<li onclick="generateWindow('glossary', '${i.trimStart()}')">${i.trimStart()}</li>`;
			}
			headerHTML += '</ul></div>';
		}

		let projectCSS = entry['css'].split(',');
		let headerCSS = '';
		if (projectCSS != '') {
			headerCSS += '<div><h5>CSS</h5><ul data-color="yellow">';
			for (let i of projectCSS) {
				headerCSS += `<li onclick="generateWindow('glossary', '${i.trimStart()}')">${i.trimStart()}</li>`;
			}
			headerCSS += '</ul></div>';
		}

		let projectJS = entry['javascript'].split(',');
		let headerJS = '';
		if (projectJS != '') {
			headerJS += '<div><h5>JavaScript</h5><ul data-color="yellow">';
			for (let i of projectJS) {
				headerJS += `<li onclick="generateWindow('glossary', '${i.trimStart()}')">${i.trimStart()}</li>`;
			}
			headerJS += '</ul></div>';
		}

		let projectMisc = entry['misc'].split(',');
		let headerMisc = '';
		if (projectMisc != '') {
			headerMisc += '<div><h5>Misc</h5><ul data-color="yellow">';
			for (let i of projectMisc) {
				headerMisc += `<li onclick="generateWindow('glossary', '${i.trimStart()}')">${i.trimStart()}</li>`;
			}
			headerMisc += '</ul></div>';
		}

		// Header number
		let headerNumber = entry['number'];
		if (headerNumber != "") {
			headerNumber = `<span>${headerNumber}</span>`;
		}

		let header = `
			<header>
				<h4>
					<span class="project-doc-subtitle">${entry['type']}${headerNumber}</span>
					<span class="project-doc-title">
						<span class="project-doc-title-name">${entry['name']}</span>
					</span>
				</h4>

				<p>${entry['summary']}</p>

				<div class="project-doc-difficulty">
					<h5>Difficulty</h5>
					<div class="project-doc-difficulty-rating">
						${headerRating}
					</div>
				</div>

				<div class="project-doc-divider"></div>

				<div class="project-doc-concepts">
					${headerConcepts}
					${headerHTML}
					${headerCSS}
					${headerJS}
					${headerMisc}
				</div>
			</header>
		`

		projectContent.innerHTML = `
			<div class="project-doc" data-color="${'blue'}">
				${header}
				${sourceBackup}
			</div>
		`;

		// Add navigation
		projectContent.innerHTML += `
			<div class="project-content-nav">
				<button class='project-content-nav-catalog'>
					<svg viewBox="0 0 100 100"><rect x="10" y="10" width="20" height="20"/><rect x="40" y="10" width="20" height="20"/><rect x="70" y="10" width="20" height="20"/><rect x="10" y="40" width="20" height="20"/><rect x="40" y="40" width="20" height="20"/><rect x="70" y="40" width="20" height="20"/><rect x="10" y="70" width="20" height="20"/><rect x="40" y="70" width="20" height="20"/><rect x="70" y="70" width="20" height="20"/></svg>
					<span>View All Projects</span>
				</button>
				<button class='project-content-nav-prev'>
					<svg viewBox="0 0 100 100"><polygon points="50 40 50 15 40 15 40 25 30 25 30 35 20 35 20 45 10 45 10 55 20 55 20 65 30 65 30 75 40 75 40 85 50 85 50 60 90 60 90 40 50 40"/></svg>
					<span>Previous Project</span>
				</button>
				<button class='project-content-nav-next'>
				<svg viewBox="0 0 100 100"><polygon points="50 40 50 15 60 15 60 25 70 25 70 35 80 35 80 45 90 45 90 55 80 55 80 65 70 65 70 75 60 75 60 85 50 85 50 60 10 60 10 40 50 40"/></svg>
					<span>Next Project</span>
				</button>
			</div>
		`
		let navPrev = target.querySelector('.project-content-nav-prev');
		navPrev.addEventListener('click', prevProject);
		let navCatalog = target.querySelector('.project-content-nav-catalog');
		navCatalog.addEventListener('click', openCatalog);
		let navNext = target.querySelector('.project-content-nav-next');
		navNext.addEventListener('click', nextProject);

		// Add share icons to titles and copyURL event listeners
		let projectTitle = projectContent.querySelector('.project-doc-title');
		projectTitle.innerHTML += `<svg viewBox="0 0 100 100"><rect x="20" y="80" width="20" height="10"/><rect x="10" y="60" width="10" height="20"/><rect x="20" y="50" width="10" height="10"/><rect x="50" y="50" width="10" height="20"/><rect x="40" y="70" width="10" height="10"/><rect x="40" y="30" width="10" height="20"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="10" width="20" height="10"/><rect x="80" y="20" width="10" height="20"/><rect x="70" y="40" width="10" height="10"/></svg>`;
		projectTitle.addEventListener('click', () => copyURL([['project',activeProject]]))
		for (let section of projectContent.querySelectorAll('.project-doc section')) {
			let sectionTitle = section.querySelector('h5');
			sectionTitle.innerHTML += `<svg viewBox="0 0 100 100"><rect x="20" y="80" width="20" height="10"/><rect x="10" y="60" width="10" height="20"/><rect x="20" y="50" width="10" height="10"/><rect x="50" y="50" width="10" height="20"/><rect x="40" y="70" width="10" height="10"/><rect x="40" y="30" width="10" height="20"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="10" width="20" height="10"/><rect x="80" y="20" width="10" height="20"/><rect x="70" y="40" width="10" height="10"/></svg>`;
			sectionTitle.addEventListener('click', () => copyURL([['project',activeProject], ['section',section.id]]));
		}

		// Add app icons to buttons
		for (let btn of projectContent.querySelectorAll(`.project-doc section button[data-color='red']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="40" y="30" width="10" height="20"/><rect x="50" y="10" width="10" height="20"/><rect x="10" y="10" width="10" height="20"/><rect x="30" y="10" width="10" height="20"/><rect x="20" y="30" width="10" height="20"/><polygon points="60 70 60 60 80 60 80 50 50 50 50 90 60 90 60 80 80 80 80 70 60 70"/><rect x="80" y="60" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of projectContent.querySelectorAll(`.project-doc section button[data-color='blue']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><polygon points="70 30 70 80 30 80 30 20 60 20 60 10 20 10 20 90 80 90 80 30 70 30"/><rect x="40" y="60" width="20" height="10"/><rect x="40" y="40" width="20" height="10"/><rect x="60" y="20" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of projectContent.querySelectorAll(`.project-doc section button[data-color='purple']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="30" y="80" width="10" height="10"/><rect x="20" y="70" width="10" height="10"/><rect x="10" y="40" width="10" height="30"/><polygon points="40 40 40 50 60 50 60 40 50 40 50 20 40 20 40 30 20 30 20 40 40 40"/><rect x="50" y="10" width="20" height="10"/><rect x="60" y="30" width="20" height="10"/><rect x="80" y="40" width="10" height="30"/><rect x="70" y="70" width="10" height="10"/><rect x="40" y="70" width="20" height="10"/><rect x="60" y="80" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of projectContent.querySelectorAll(`.project-doc section button[data-color='yellow']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="80" y="80" width="10" height="10"/><rect x="70" y="70" width="10" height="10"/><rect x="60" y="60" width="10" height="10"/><rect x="50" y="50" width="10" height="10"/><rect x="30" y="60" width="20" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="10" y="30" width="10" height="20"/><rect x="20" y="20" width="10" height="10"/><rect x="30" y="10" width="20" height="10"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="30" width="10" height="20"/></svg>` + btn.innerHTML;
		}
		for (let btn of projectContent.querySelectorAll(`.project-doc section button[data-color='green']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><polygon points="30 70 20 70 20 60 10 60 10 90 40 90 40 80 30 80 30 70"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="40" width="10" height="10"/><rect x="40" y="30" width="10" height="10"/><polygon points="80 30 80 20 70 20 70 10 60 10 60 20 50 20 50 30 60 30 60 40 70 40 70 50 80 50 80 40 90 40 90 30 80 30"/><rect x="60" y="50" width="10" height="10"/><rect x="50" y="60" width="10" height="10"/><rect x="40" y="70" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of projectContent.querySelectorAll(`.project-doc section button[data-color='pink']`)) {
			btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="10" y="40" width="10" height="10"/><rect x="20" y="30" width="10" height="10"/><rect x="20" y="50" width="10" height="10"/><rect x="30" y="70" width="10" height="20"/><rect x="40" y="50" width="10" height="20"/><rect x="50" y="30" width="10" height="20"/><rect x="60" y="10" width="10" height="20"/><rect x="70" y="60" width="10" height="10"/><rect x="80" y="50" width="10" height="10"/><rect x="70" y="40" width="10" height="10"/></svg>` + btn.innerHTML;
		}
		for (let btn of projectContent.querySelectorAll(`.project-doc section button`)) {
			if (btn.dataset.color == undefined) {
				btn.innerHTML = `<svg viewBox="0 0 100 100"><rect x="20" y="80" width="20" height="10"/><rect x="10" y="60" width="10" height="20"/><rect x="20" y="50" width="10" height="10"/><rect x="50" y="50" width="10" height="20"/><rect x="40" y="70" width="10" height="10"/><rect x="40" y="30" width="10" height="20"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="10" width="20" height="10"/><rect x="80" y="20" width="10" height="20"/><rect x="70" y="40" width="10" height="10"/></svg>` + btn.innerHTML;
			}
		}

		// Jump to section on initial load
		if (initialize == true) {
			let url = new URL(window.location.href);
			let params = new URLSearchParams(url.search);
			if (params.has('section')) {
				setTimeout(() => {
					jumpToSection(params.get('section'));
				}, 500);
			}
			initialize = false;
		}

		target.dataset.menu = 0;
	}

	function jumpToSection(section) {
		let anchor = projectContent.querySelector('#' + section);
		anchor.scrollIntoView({
			behavior: 'smooth',
			block: "start",
		});
	}

	// project traversal
	function openProject(source) {
		activeProject = source.split('.')[0];
		fetchSource(source);
	}
	function openCatalog() {
		target.dataset.menu = 1;
	}
	function prevProject() {
		activeIndex--;
		if (activeIndex < 0) {
			activeIndex = projectsBackup.length-1;
		}
		if (projectsBackup[activeIndex]['active'] == 0) {
			prevProject();
		} else {
			openProject(projectsBackup[activeIndex]['source']);
		}
	}
	function nextProject() {
		activeIndex++;
		if (activeIndex >= projectsBackup.length) {
			activeIndex = 0;
		}
		if (projectsBackup[activeIndex]['active'] == 0) {
			nextProject();
		} else {
			openProject(projectsBackup[activeIndex]['source']);
		}
	}
}

// ————————————————————————————————————————————————————————————
// CODE EDITOR (USING CODEMIRROR)
// ————————————————————————————————————————————————————————————

let codeMirrors = {};
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
					<svg viewBox="0 0 100 100"><rect x="20" y="80" width="20" height="10"/><rect x="10" y="60" width="10" height="20"/><rect x="20" y="50" width="10" height="10"/><rect x="50" y="50" width="10" height="20"/><rect x="40" y="70" width="10" height="10"/><rect x="40" y="30" width="10" height="20"/><rect x="50" y="20" width="10" height="10"/><rect x="60" y="10" width="20" height="10"/><rect x="80" y="20" width="10" height="20"/><rect x="70" y="40" width="10" height="10"/></svg>
					<span>Copy URL</span>
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
			<svg viewBox="0 0 100 100"><polygon points="50 40 50 15 40 15 40 25 30 25 30 35 20 35 20 45 10 45 10 55 20 55 20 65 30 65 30 75 40 75 40 85 50 85 50 60 90 60 90 40 50 40"/></svg>
			<span>Code</span>
			<svg viewBox="0 0 100 100"><polygon points="50 40 50 15 40 15 40 25 30 25 30 35 20 35 20 45 10 45 10 55 20 55 20 65 30 65 30 75 40 75 40 85 50 85 50 60 90 60 90 40 50 40"/></svg>
		</div>
		<div class="editor-preview-container">
			<iframe class="editor-preview"></iframe>
			<h4>Live Preview!</h4>
		</div>
	`

	let targetCodeEditor = targetContent.querySelector('.editor-text');
	let targetPreview = targetContent.querySelector('.editor-preview');

	// Create CodeMirror editor
	let targetCodeMirror = CodeMirror.fromTextArea(targetCodeEditor, {
		mode: "htmlmixed",
		styleActiveLine: true,
		lineNumbers: true,
		tabSize: 2,
		lineWrapping: true,
		theme: "gdwithgd",
	});
	targetCodeMirror.on("change", updatePreview);
	function updatePreview() {
		targetPreview.srcdoc = targetCodeMirror.getValue();
	}
	setTimeout(() => {
		targetCodeMirror.refresh();
	}, 300)
	codeMirrors[id] = targetCodeMirror;

	// Get source file if specified
	if (source != undefined) {
		targetContent.dataset.source = 1;
		fetchSource();
	} else {
		targetContent.dataset.source = 1;
		source = 'template.html';
		fetchSource();
	}
	let sourceBackup;
	async function fetchSource() {
		let displayName = targetContent.querySelector(".editor-info-name");
		displayName.innerText = source;
		const response = await fetch("sources/demos/"+source);
		const data = await response.text();
		sourceBackup = data;
		targetCodeMirror.setValue(data);
	}

	// Reset code
	let targetBtnReset = targetContent.querySelector('.editor-btn-reset');
	targetBtnReset.addEventListener('click', resetCode);
	function resetCode() {
		targetCodeMirror.setValue(sourceBackup);
	}

	// Copy shareable link to code
	let targetBtnShare = targetContent.querySelector('.editor-btn-share');
	targetBtnShare.addEventListener('click', () => copyURL([['demo', source.split('.')[0]]]));

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
	let targetWrap = true;
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
		targetCodeMirror.refresh();
	}
}

// Activate and deactivate previews to avoid mouse capture
function setActivePreview(id) {
	deactivatePreviews();
	let target = document.querySelector("#"+id);
	if (target.dataset.type == 'code-editor') {
		codeMirrors[id].refresh();
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
document.addEventListener("visibilitychange", refreshEditors);
function refreshEditors() {
	for (let id of Object.keys(codeMirrors)) {
		codeMirrors[id].refresh();
	}
}

// ————————————————————————————————————————————————————————————
// GENERATING CONTENT BASED ON URL
// ————————————————————————————————————————————————————————————

let url = new URL(window.location.href);
let params = new URLSearchParams(url.search);
if (params.has("welcome")) {
	generateWindow('welcome');
} else if (params.has("document")) {
	generateWindow('documents', params.get("document"), params.get("section"));
} else if (params.has("lesson")) {
	generateWindow('lessons', params.get("lesson") + ".html");
} else if (params.has("glossary")) {
	generateWindow('glossary', params.get("glossary") + ".html");
} else if (params.has("project")) {
	generateWindow('projects', params.get("project") + ".html");
} else if (params.has("demo")) {
	generateWindow('code-editor', params.get("demo") + ".html");
} else {
	generateWindow('welcome');
}

function copyURL(pairs) {
	let url = window.location.href.split('?')[0] + "?";
	for (let pair of pairs) {
		url += pair[0] + "=" + pair[1];
		if (pair != pairs[pairs.length-1]) {
			url += "&";
		}
	}
	navigator.clipboard.writeText(url);

	// Show alert
	let alert = document.querySelector('.alert');
	let alertMsg = alert.querySelector('.alert-msg');
	alertMsg.innerText = "URL copied!";
	alert.dataset.show = 1;
	setTimeout(() => {
		alert.dataset.show = 0;
	}, 1000)
}

// ————————————————————————————————————————————————————————————
// HELPER FUNCTIONS
// ————————————————————————————————————————————————————————————

// Find object entry by property value
function findByProperty(json, property, value) {
	for (let key in json) {
		let object = json[key]
		if (object[property] == value) return key;
	}
	return false;
}

// Open external link function for buttons
function openLink(url) {
	window.open(url, "_blank");
}