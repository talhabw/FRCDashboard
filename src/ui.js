// Define UI elements
let ui = {
    timer: document.getElementById('timer'),
    robotState: document.getElementById('robot-state').firstChild,
    gyro: {
        val: 0,
        offset: 0,
        visualVal: 0,
        valueElement: document.getElementById('gyroValue')
    },
    circleProgressBars: {
        batteryVoltage: [
            document.querySelector('#batteryVoltage .mask.full'),
            document.querySelectorAll('#batteryVoltage .circle .fill'),
            document.querySelector('#batteryVoltage .inside-circle')
        ],
        cpuUsage: [
            document.querySelector('#cpuUsage .mask.full'),
            document.querySelectorAll('#cpuUsage .circle .fill'),
            document.querySelector('#cpuUsage .inside-circle')
        ],
        powerDraw: [
            document.querySelector('#powerDraw .mask.full'),
            document.querySelectorAll('#powerDraw .circle .fill'),
            document.querySelector('#powerDraw .inside-circle')
        ],
        ramUsage: [
            document.querySelector('#ramUsage .mask.full'),
            document.querySelectorAll('#ramUsage .circle .fill'),
            document.querySelector('#ramUsage .inside-circle')
        ],
    },
    horizontalProgressBars: {
        frontLeftWheel: document.getElementById('frontLeftWheelPU'),
        frontRightWheel: document.getElementById('frontRightWheelPU'),
        backLeftWheel: document.getElementById('backLeftWheelPU'),
        backRightWheel: document.getElementById('backRightWheelPU'),
        climberMotor: document.getElementById('climberMotorPU'),
        roborio: document.getElementById('roborioPU'),
        limelight: document.getElementById('limelightPU'),
        leds: document.getElementById('ledsPU'),
    }
    /* robotDiagram: {
        arm: document.getElementById('robot-arm')
    }, */
    /* example: {
        button: document.getElementById('example-button'),
        readout: document.getElementById('example-readout').firstChild
    }, */
    /* autoSelect: document.getElementById('auto-select'),
    armPosition: document.getElementById('arm-position') */
};

// Key Listeners

drawCompass('gyro', 73)
// Gyro rotation
let updateGyro = (key, value) => {
    ui.gyro.val = value;
    ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
    ui.gyro.visualVal %= 360;
    if (ui.gyro.visualVal < 0) {
        ui.gyro.visualVal += 360;
    }
    drawCompass('gyro', ui.gyro.visualVal)
    ui.gyro.valueElement.textContent = ui.gyro.visualVal + 'º';
};
//NetworkTables.addKeyListener('/SmartDashboard/drive/navx/yaw', updateGyro);

// Reset gyro value to 0 on click
/* ui.gyro.container.onclick = function () {
    // Store previous gyro val, will now be subtracted from val for callibration
    ui.gyro.offset = ui.gyro.val;
    // Trigger the gyro to recalculate value.
    updateGyro('/SmartDashboard/drive/navx/yaw', ui.gyro.val);
}; */

// PDP
let voltage = 12.3
let amp = 24.7
let cpu = 84
let ram = 32
updateCircleProgress(ui.circleProgressBars.batteryVoltage, `${voltage}v`, mapDegree(mapVoltage(voltage)))
updateCircleProgress(ui.circleProgressBars.powerDraw, `${amp}A`, mapDegree(mapAmp(amp)))
updateCircleProgress(ui.circleProgressBars.cpuUsage, `${cpu}%`, mapDegree(cpu))
updateCircleProgress(ui.circleProgressBars.ramUsage, `${ram}%`, mapDegree(ram))

updateHorizontalProgressBar(ui.horizontalProgressBars.frontLeftWheel, 30, 40)
updateHorizontalProgressBar(ui.horizontalProgressBars.frontRightWheel, 33, 40)
updateHorizontalProgressBar(ui.horizontalProgressBars.backLeftWheel, 25, 40)
updateHorizontalProgressBar(ui.horizontalProgressBars.backRightWheel, 38, 40)
updateHorizontalProgressBar(ui.horizontalProgressBars.climberMotor, 13, 40)
updateHorizontalProgressBar(ui.horizontalProgressBars.roborio, 7, 20)
updateHorizontalProgressBar(ui.horizontalProgressBars.limelight, 5, 20)
updateHorizontalProgressBar(ui.horizontalProgressBars.leds, 17, 20)


// The following case is an example, for a robot with an arm at the front.
NetworkTables.addKeyListener('/SmartDashboard/arm/encoder', (key, value) => {
    // 0 is all the way back, 1200 is 45 degrees forward. We don't want it going past that.
    if (value > 1140) {
        value = 1140;
    }
    else if (value < 0) {
        value = 0;
    }
    // Calculate visual rotation of arm
    var armAngle = value * 3 / 20 - 45;
    // Rotate the arm in diagram to match real arm
    ui.robotDiagram.arm.style.transform = `rotate(${armAngle}deg)`;
});

// Get value of arm height slider when it's adjusted
ui.armPosition.oninput = function () {
    NetworkTables.putValue('/SmartDashboard/arm/encoder', parseInt(this.value));
};

// This button is just an example of triggering an event on the robot by clicking a button.
NetworkTables.addKeyListener('/SmartDashboard/example_variable', (key, value) => {
    // Set class active if value is true and unset it if it is false
    ui.example.button.classList.toggle('active', value);
    ui.example.readout.data = 'Value is ' + value;
});

// Example button listener
ui.example.button.onclick = function () {
    // Set NetworkTables values to the opposite of whether button has active class.
    NetworkTables.putValue('/SmartDashboard/example_variable', this.className != 'active');
};

NetworkTables.addKeyListener('/robot/time', (key, value) => {
    // This is an example of how a dashboard could display the remaining time in a match.
    // We assume here that value is an integer representing the number of seconds left.
    ui.timer.textContent = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60;
});

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/autonomous/modes', (key, value) => {
    // Clear previous list
    while (ui.autoSelect.firstChild) {
        ui.autoSelect.removeChild(ui.autoSelect.firstChild);
    }
    // Make an option for each autonomous mode and put it in the selector
    for (let i = 0; i < value.length; i++) {
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(value[i]));
        ui.autoSelect.appendChild(option);
    }
    // Set value to the already-selected mode. If there is none, nothing will happen.
    ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
});

// Load selected auto mode
NetworkTables.addKeyListener('/SmartDashboard/autonomous/selected', (key, value) => {
    ui.autoSelect.value = value;
});

// Update NetworkTables when autonomous selector is changed
ui.autoSelect.onchange = function () {
    NetworkTables.putValue('/SmartDashboard/autonomous/selected', this.value);
};

addEventListener('error', (ev) => {
    ipc.send('windowError', { mesg: ev.message, file: ev.filename, lineNumber: ev.lineno })
})

function updateCircleProgress(list, value, visualValue) {
    if (visualValue > 180) visualValue = 180
    else if (visualValue < 0) visualValue = 0

    list[0].style.transform = `rotate(${visualValue}deg)`
    list[1][0].style.transform = `rotate(${visualValue}deg)`
    list[1][1].style.transform = `rotate(${visualValue}deg)`

    list[2].textContent = value
}

function mapDegree(value) {
    return value / 100 * 360 / 2
}

function mapVoltage(value) {
    return value / 13.5 * 100
}

function mapAmp(value) {
    return value / 40 * 100
}

function updateHorizontalProgressBar(progressbar, value, ampLimit) {
    let visualValue = value / ampLimit * 100

    if (visualValue > 100) visualValue = 100
    else if (visualValue < 0) visualValue = 0

    progressbar.style.width = `${visualValue}%`
    progressbar.innerText = `${value}A`
}