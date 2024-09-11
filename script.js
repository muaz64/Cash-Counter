document.addEventListener('DOMContentLoaded', () => {
    const cashInputs = document.querySelectorAll('.cash-input');
    const cashTexts = document.querySelectorAll('.cash-text');
    const txtFinalCash = document.getElementById('txtFinalCash');
    const txtFinalCashInWords = document.getElementById('txtFinalCashInWords');
    const btnReset = document.getElementById('btnReset');
    const keypad = document.getElementById('keypad');
    let activeInput = null;

    // Cash input field listeners
    cashInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            const value = parseInt(input.value, 10);
            if (isNaN(value) || value < 0) {
                input.value = '';
            } else {
                cashCalculate(index);
            }
        });
    });

    // Reset button functionality
    btnReset.addEventListener('click', clearData);

    // Cash calculation for each denomination
    function cashCalculate(index) {
        const denominations = [1000, 500, 200, 100, 50, 20, 10, 5, 2, 1];
        const rowValue = cashInputs[index].value * denominations[index];
        cashTexts[index].textContent = rowValue.toFixed(0);
        totalCash();
    }

    // Calculate total cash and update in both numeric and words format
    function totalCash() {
        let totalCashValue = 0;
        cashTexts.forEach(text => {
            totalCashValue += parseInt(text.textContent);
        });

        // Update total cash values
        txtFinalCash.textContent = 'Total Cash: ' + totalCashValue;
        txtFinalCashInWords.textContent = `Total Cash In Words: ${convertToWords(totalCashValue)}`;

        // Trigger transition effect
        addTransitionEffect(txtFinalCash);
        addTransitionEffect(txtFinalCashInWords);
    }

    // Clear all data
    function clearData() {
        cashInputs.forEach(input => {
            input.value = '';
        });
        cashTexts.forEach(text => {
            text.textContent = '0';
        });
        totalCash();

        // Hide keypad and reset active input
        keypad.classList.add('hidden');
        activeInput = null;
    }

    // Convert total cash number into words
    function convertToWords(number) {
        const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
        if (number === 0) {
            return 'Zero';
        }
    
        let words = '';
    
        if (Math.floor(number / 10000000) > 0) {
            words += convertToWords(Math.floor(number / 10000000)) + ' Crore ';
            number %= 10000000;
        }
    
        if (Math.floor(number / 100000) > 0) {
            words += convertToWords(Math.floor(number / 100000)) + ' Lakh ';
            number %= 100000;
        }
    
        if (Math.floor(number / 1000) > 0) {
            words += convertToWords(Math.floor(number / 1000)) + ' Thousand ';
            number %= 1000;
        }
    
        if (Math.floor(number / 100) > 0) {
            words += convertToWords(Math.floor(number / 100)) + ' Hundred ';
            number %= 100;
        }
    
        if (number > 0) {
            if (number < 10) {
                words += units[number];
            } else if (number < 20) {
                words += teens[number - 10];
            } else {
                words += tens[Math.floor(number / 10)];
                if (number % 10 > 0) {
                    words += ' ' + units[number % 10];
                }
            }
        }
    
        return words.trim();
    }

    // Transition effect for smooth total updates
    function addTransitionEffect(element) {
        element.classList.add('total-update');  // Add animation class
        setTimeout(() => {
            element.classList.remove('total-update');  // Remove class after animation
        }, 300);  // Match the transition timing (0.3s)
    }

    // Open keypad when clicking on an input field
    cashInputs.forEach(input => {
        input.addEventListener('focus', () => {
            activeInput = input;
            keypad.classList.remove('hidden');
        });
    });

    // Hide keypad when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.keypad') && !event.target.classList.contains('cash-input')) {
            keypad.classList.add('hidden');
        }
    });

    // Handle keypad button clicks with value validation
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => {
            if (activeInput) {
                const value = key.getAttribute('data-value');
                if (value !== null) {
                    const newValue = activeInput.value + value;
                    if (!isNaN(parseInt(newValue)) && parseInt(newValue) >= 0) {  // Validate numeric value
                        activeInput.value = newValue;
                        cashCalculate(Array.from(cashInputs).indexOf(activeInput));  // Update calculation in real-time
                    }
                }
            }
        });
    });

    // Clear button functionality for the keypad
    document.getElementById('clearKey').addEventListener('click', () => {
        if (activeInput) {
            activeInput.value = '';
            cashCalculate(Array.from(cashInputs).indexOf(activeInput));
        }
    });
});
