/* =========================================================
   IACS - MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       CLOCK
       ===================================================== */

    const clock = document.getElementById("clock");

    function updateClock() {

        if (!clock) return;

        const now = new Date();

        clock.textContent =
            now.toLocaleTimeString("en-GB", {
                hour12: false
            });
    }

    updateClock();

    setInterval(updateClock, 1000);


    /* =====================================================
       SIMULATION VALUES
       ===================================================== */

    let systemData = {

        soc: 78,
        soh: 94,

        batteryTemp: 31.5,

        inputVoltage: 230.0,
        inputCurrent: 1.35,

        outputVoltage: 48.6,
        outputCurrent: 6.4,

        power: 311,

        charging: true,
        powerEnabled: true

    };


    /* =====================================================
       HELPER
       ===================================================== */

    function setText(id, value) {

        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }


    /* =====================================================
       UPDATE DASHBOARD
       ===================================================== */

    function updateDashboard() {

        setText("soc", Math.round(systemData.soc));
        setText("soh", Math.round(systemData.soh));

        setText(
            "batteryTemp",
            systemData.batteryTemp.toFixed(1)
        );

        setText(
            "inputVoltage",
            systemData.inputVoltage.toFixed(1)
        );

        setText(
            "inputCurrent",
            systemData.inputCurrent.toFixed(2)
        );

        setText(
            "outputVoltage",
            systemData.outputVoltage.toFixed(1)
        );

        setText(
            "outputCurrent",
            systemData.outputCurrent.toFixed(1)
        );

        setText(
            "power",
            Math.round(systemData.power)
        );

        setText(
            "gridPower",
            Math.round(systemData.power)
        );


        setText(
            "healthSOC",
            Math.round(systemData.soc)
        );

        setText(
            "healthSOH",
            Math.round(systemData.soh)
        );

        setText(
            "healthTemp",
            systemData.batteryTemp.toFixed(1)
        );


        /* SOC BAR */

        const socBar =
            document.getElementById("socBar");

        if (socBar) {
            socBar.style.width =
                systemData.soc + "%";
        }


        /* SOH BAR */

        const sohBar =
            document.getElementById("sohBar");

        if (sohBar) {
            sohBar.style.width =
                systemData.soh + "%";
        }


        /* CHARGING STATUS */

        const status =
            document.getElementById(
                "dashboardChargingStatus"
            );

        if (status) {

            if (
                systemData.charging &&
                systemData.powerEnabled
            ) {

                status.textContent =
                    "● Charging";

            } else {

                status.textContent =
                    "● Idle";
            }
        }
    }


    /* =====================================================
       SIMULATION UPDATE
       ===================================================== */

    function simulateData() {

        if (
            systemData.charging &&
            systemData.powerEnabled
        ) {

            systemData.inputVoltage =
                229.5 +
                Math.random() * 1.2;

            systemData.outputVoltage =
                systemData.outputVoltage +
                (Math.random() - 0.5) * 0.15;

            systemData.outputVoltage =
                Math.max(
                    40,
                    Math.min(
                        60,
                        systemData.outputVoltage
                    )
                );


            systemData.outputCurrent =
                systemData.outputCurrent +
                (Math.random() - 0.5) * 0.15;

            systemData.outputCurrent =
                Math.max(
                    0,
                    Math.min(
                        10,
                        systemData.outputCurrent
                    )
                );


            systemData.inputCurrent =
                (
                    systemData.power /
                    systemData.inputVoltage
                );


            systemData.power =
                systemData.outputVoltage *
                systemData.outputCurrent;


            systemData.batteryTemp +=
                (Math.random() - 0.5) * 0.15;


            systemData.batteryTemp =
                Math.max(
                    20,
                    Math.min(
                        45,
                        systemData.batteryTemp
                    )
                );


            systemData.soc += 0.01;

            if (systemData.soc >= 100) {
                systemData.soc = 100;
            }

        }

        updateDashboard();
        updateChart();
    }


    /* =====================================================
       CHART
       ===================================================== */

    let electricalChart = null;

    const chartCanvas =
        document.getElementById(
            "electricalChart"
        );


    const chartLabels = [];

    const voltageInputData = [];
    const voltageOutputData = [];

    const currentInputData = [];
    const currentOutputData = [];


    function createChart() {

        if (!chartCanvas) return;

        const ctx =
            chartCanvas.getContext("2d");


        electricalChart =
            new Chart(ctx, {

                type: "line",

                data: {

                    labels: chartLabels,

                    datasets: [

                        {
                            label: "Input Voltage (V)",

                            data:
                                voltageInputData,

                            borderWidth: 2,

                            tension: 0.35,

                            yAxisID: "voltage"
                        },

                        {
                            label: "Output Voltage (V)",

                            data:
                                voltageOutputData,

                            borderWidth: 2,

                            tension: 0.35,

                            yAxisID: "voltage"
                        },

                        {
                            label: "Input Current (A)",

                            data:
                                currentInputData,

                            borderWidth: 2,

                            tension: 0.35,

                            yAxisID: "current"
                        },

                        {
                            label: "Output Current (A)",

                            data:
                                currentOutputData,

                            borderWidth: 2,

                            tension: 0.35,

                            yAxisID: "current"
                        }

                    ]

                },

                options: {

                    responsive: true,

                    maintainAspectRatio: false,

                    interaction: {
                        mode: "index",
                        intersect: false
                    },

                    plugins: {

                        legend: {
                            display: true
                        }

                    },

                    scales: {

                        voltage: {

                            type: "linear",

                            position: "left",

                            title: {
                                display: true,
                                text: "Voltage (V)"
                            }

                        },

                        current: {

                            type: "linear",

                            position: "right",

                            title: {
                                display: true,
                                text: "Current (A)"
                            },

                            grid: {
                                drawOnChartArea: false
                            }

                        }

                    }

                }

            });
    }


    function updateChart() {

        if (!electricalChart) return;


        const now =
            new Date().toLocaleTimeString(
                "en-GB",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                }
            );


        chartLabels.push(now);

        voltageInputData.push(
            systemData.inputVoltage
        );

        voltageOutputData.push(
            systemData.outputVoltage
        );

        currentInputData.push(
            systemData.inputCurrent
        );

        currentOutputData.push(
            systemData.outputCurrent
        );


        /* Keep last 20 points */

        if (chartLabels.length > 20) {

            chartLabels.shift();

            voltageInputData.shift();
            voltageOutputData.shift();

            currentInputData.shift();
            currentOutputData.shift();
        }


        electricalChart.update("none");
    }


    createChart();

    updateDashboard();


    /* =====================================================
       INITIAL CHART DATA
       ===================================================== */

    for (let i = 0; i < 10; i++) {

        updateChart();
    }


    /* =====================================================
       RUN SIMULATION
       ===================================================== */

    setInterval(
        simulateData,
        2000
    );


    /* =====================================================
       CHARGING CONTROL
       ===================================================== */

    window.toggleChargingPower =
        function () {

            systemData.powerEnabled =
                !systemData.powerEnabled;


            const button =
                document.getElementById(
                    "powerButton"
                );

            const text =
                document.getElementById(
                    "powerButtonText"
                );

            const state =
                document.getElementById(
                    "powerStateBadge"
                );

            const indicator =
                document.getElementById(
                    "powerIndicator"
                );

            const powerText =
                document.getElementById(
                    "powerText"
                );

            const powerSubtext =
                document.getElementById(
                    "powerSubtext"
                );


            if (systemData.powerEnabled) {

                if (button) {
                    button.classList.add("on");
                }

                if (indicator) {
                    indicator.classList.add("on");
                }

                if (text) {
                    text.textContent =
                        "POWER OFF";
                }

                if (state) {
                    state.textContent = "ON";
                }

                if (powerText) {
                    powerText.textContent =
                        "POWER ON";
                }

                if (powerSubtext) {
                    powerSubtext.textContent =
                        "Charging system is enabled";
                }

            } else {

                systemData.charging = false;

                if (button) {
                    button.classList.remove("on");
                }

                if (indicator) {
                    indicator.classList.remove("on");
                }

                if (text) {
                    text.textContent =
                        "POWER ON";
                }

                if (state) {
                    state.textContent = "OFF";
                }

                if (powerText) {
                    powerText.textContent =
                        "POWER OFF";
                }

                if (powerSubtext) {
                    powerSubtext.textContent =
                        "Charging system is disabled";
                }
            }


            updateChargingPage();

            updateDashboard();
        };


    /* =====================================================
       START CHARGING
       ===================================================== */

    window.startCharging =
        function () {

            if (!systemData.powerEnabled) {

                showToast(
                    "Turn POWER ON first"
                );

                return;
            }


            systemData.charging = true;

            updateChargingPage();

            updateDashboard();

            showToast(
                "✓ Charging started"
            );
        };


    /* =====================================================
       STOP CHARGING
       ===================================================== */

    window.stopCharging =
        function () {

            systemData.charging = false;

            updateChargingPage();

            updateDashboard();

            showToast(
                "✓ Charging stopped"
            );
        };


    /* =====================================================
       CURRENT CONTROL
       ===================================================== */

    const currentSlider =
        document.getElementById(
            "currentSlider"
        );

    const chargingCurrent =
        document.getElementById(
            "chargingCurrent"
        );


    if (currentSlider) {

        currentSlider.addEventListener(
            "input",
            function () {

                const value =
                    parseFloat(
                        this.value
                    );

                if (chargingCurrent) {

                    chargingCurrent.textContent =
                        value.toFixed(1);
                }
            }
        );
    }


    window.adjustCurrent =
        function (amount) {

            if (!currentSlider) return;

            let value =
                parseFloat(
                    currentSlider.value
                );


            value += amount;


            value =
                Math.max(
                    0,
                    Math.min(
                        10,
                        value
                    )
                );


            value =
                Math.round(
                    value * 10
                ) / 10;


            currentSlider.value =
                value;


            if (chargingCurrent) {

                chargingCurrent.textContent =
                    value.toFixed(1);
            }
        };


    window.applyCharging =
        function () {

            if (!currentSlider) return;


            systemData.outputCurrent =
                parseFloat(
                    currentSlider.value
                );


            showToast(
                "✓ Current setpoint updated to " +
                systemData.outputCurrent.toFixed(1) +
                " A"
            );


            updateDashboard();
        };


    /* =====================================================
       VOLTAGE CONTROL
       ===================================================== */

    const voltageSlider =
        document.getElementById(
            "voltageSlider"
        );

    const voltageSetpoint =
        document.getElementById(
            "voltageSetpoint"
        );


    if (voltageSlider) {

        voltageSlider.addEventListener(
            "input",
            function () {

                if (voltageSetpoint) {

                    voltageSetpoint.textContent =
                        parseFloat(
                            this.value
                        ).toFixed(1);
                }
            }
        );
    }


    window.adjustVoltage =
        function (amount) {

            if (!voltageSlider) return;


            let value =
                parseFloat(
                    voltageSlider.value
                );


            value += amount;


            value =
                Math.max(
                    40,
                    Math.min(
                        60,
                        value
                    )
                );


            value =
                Math.round(
                    value * 10
                ) / 10;


            voltageSlider.value =
                value;


            if (voltageSetpoint) {

                voltageSetpoint.textContent =
                    value.toFixed(1);
            }
        };


    window.applyVoltage =
        function () {

            if (!voltageSlider) return;


            systemData.outputVoltage =
                parseFloat(
                    voltageSlider.value
                );


            showToast(
                "✓ Voltage setpoint updated to " +
                systemData.outputVoltage.toFixed(1) +
                " V"
            );


            updateDashboard();
        };


    /* =====================================================
       CHARGING PAGE UPDATE
       ===================================================== */

    function updateChargingPage() {

        const badge =
            document.getElementById(
                "chargingStateBadge"
            );

        const statusText =
            document.getElementById(
                "statusText"
            );

        const statusSubtext =
            document.getElementById(
                "statusSubtext"
            );


        if (
            systemData.charging &&
            systemData.powerEnabled
        ) {

            if (badge) {
                badge.textContent =
                    "CHARGING";
            }

            if (statusText) {
                statusText.textContent =
                    "Charging Active";
            }

            if (statusSubtext) {
                statusSubtext.textContent =
                    "Energy is being delivered to the vehicle";
            }

        } else {

            if (badge) {
                badge.textContent =
                    "IDLE";
            }

            if (statusText) {
                statusText.textContent =
                    "Charging Idle";
            }

            if (statusSubtext) {
                statusSubtext.textContent =
                    "No energy is currently being delivered";
            }
        }


        setText(
            "chargingVoltage",
            systemData.outputVoltage.toFixed(1)
        );

        setText(
            "liveCurrent",
            systemData.outputCurrent.toFixed(1)
        );

        setText(
            "chargingPower",
            Math.round(systemData.power)
        );

        setText(
            "chargingSOC",
            Math.round(systemData.soc)
        );
    }


    /* =====================================================
       TOAST
       ===================================================== */

    function showToast(message) {

        const toast =
            document.getElementById(
                "toast"
            );

        if (!toast) return;


        toast.textContent =
            message;

        toast.classList.add("show");


        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );
    }

});
