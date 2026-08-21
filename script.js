/* =====================================================
   VOLTAGE CONTROL
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const voltageSlider =
        document.getElementById("voltageSlider");

    const voltageSetpoint =
        document.getElementById("voltageSetpoint");

    const voltageDecrease =
        document.getElementById("voltageDecrease");

    const voltageIncrease =
        document.getElementById("voltageIncrease");

    const applyVoltageButton =
        document.getElementById("applyVoltageButton");


    /* Stop if this is not the charging page */

    if (
        !voltageSlider ||
        !voltageSetpoint
    ) {
        return;
    }


    /* ================================
       UPDATE DISPLAY
       ================================ */

    function updateVoltageDisplay() {

        const value =
            parseFloat(voltageSlider.value);

        voltageSetpoint.textContent =
            value.toFixed(1);

    }


    /* ================================
       SLIDER
       ================================ */

    voltageSlider.addEventListener(
        "input",
        function () {

            updateVoltageDisplay();

        }
    );


    /* ================================
       DECREASE VOLTAGE
       ================================ */

    if (voltageDecrease) {

        voltageDecrease.addEventListener(
            "click",
            function () {

                let value =
                    parseFloat(voltageSlider.value);

                value -= 0.1;

                value =
                    Math.max(40, value);

                value =
                    Math.round(value * 10) / 10;

                voltageSlider.value =
                    value;

                updateVoltageDisplay();

            }
        );

    }


    /* ================================
       INCREASE VOLTAGE
       ================================ */

    if (voltageIncrease) {

        voltageIncrease.addEventListener(
            "click",
            function () {

                let value =
                    parseFloat(voltageSlider.value);

                value += 0.1;

                value =
                    Math.min(60, value);

                value =
                    Math.round(value * 10) / 10;

                voltageSlider.value =
                    value;

                updateVoltageDisplay();

            }
        );

    }


    /* ================================
       APPLY VOLTAGE
       ================================ */

    if (applyVoltageButton) {

        applyVoltageButton.addEventListener(
            "click",
            function () {

                const value =
                    parseFloat(
                        voltageSlider.value
                    ).toFixed(1);


                voltageSetpoint.textContent =
                    value;


                showVoltageToast(
                    "✓ Voltage setpoint updated to " +
                    value +
                    " V"
                );

            }
        );

    }


    /* Initial display */

    updateVoltageDisplay();

});


/* =====================================================
   VOLTAGE TOAST
   ===================================================== */

function showVoltageToast(message) {

    const toast =
        document.getElementById("toast");

    if (!toast) return;


    toast.textContent =
        message;

    toast.classList.add("show");


    setTimeout(function () {

        toast.classList.remove("show");

    }, 2500);

}
