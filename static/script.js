document.addEventListener('DOMContentLoaded', () => {
    const loanForm = document.getElementById('loanForm');
    const incomeInput = document.getElementById('person_income');
    const loanAmntInput = document.getElementById('loan_amnt');
    const loanPercentIncomeInput = document.getElementById('loan_percent_income');
    
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    
    const placeholderResult = document.getElementById('placeholderResult');
    const resultContent = document.getElementById('resultContent');
    
    const riskBadge = document.getElementById('riskBadge');
    const riskText = document.getElementById('riskText');
    const probValue = document.getElementById('probValue');
    const thresholdValue = document.getElementById('thresholdValue');
    const progressBar = document.getElementById('progressBar');
    const scorePercentage = document.getElementById('scorePercentage');
    const recommendationText = document.getElementById('recommendationText');

    // Auto-calculate loan_percent_income when income or loan amount updates
    function calculateLoanPercentIncome() {
        const income = parseFloat(incomeInput.value);
        const loanAmnt = parseFloat(loanAmntInput.value);
        
        if (income && loanAmnt && income > 0) {
            const ratio = loanAmnt / income;
            loanPercentIncomeInput.value = ratio.toFixed(4);
        } else {
            loanPercentIncomeInput.value = '';
        }
    }

    incomeInput.addEventListener('input', calculateLoanPercentIncome);
    loanAmntInput.addEventListener('input', calculateLoanPercentIncome);

    // Form submission handler
    loanForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Show loading state
        submitBtn.disabled = true;
        spinner.hidden = false;
        submitBtn.querySelector('span').textContent = 'Evaluating...';

        // Gather form data and parse types correctly matching Pydantic model
        const payload = {
            person_age: parseInt(document.getElementById('person_age').value),
            person_income: parseFloat(incomeInput.value),
            person_home_ownership: document.getElementById('person_home_ownership').value,
            person_emp_length: parseFloat(document.getElementById('person_emp_length').value),
            loan_intent: document.getElementById('loan_intent').value,
            loan_grade: document.getElementById('loan_grade').value,
            loan_amnt: parseFloat(loanAmntInput.value),
            loan_int_rate: parseFloat(document.getElementById('loan_int_rate').value),
            loan_percent_income: parseFloat(loanPercentIncomeInput.value),
            cb_person_default_on_file: document.getElementById('cb_person_default_on_file').value,
            cb_person_cred_hist_length: parseInt(document.getElementById('cb_person_cred_hist_length').value)
        };

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Prediction request failed.');
            }

            const result = await response.json();
            displayResults(result);

        } catch (error) {
            alert('Error connecting to prediction server. Make sure FastAPI is running.');
            console.error(error);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            spinner.hidden = true;
            submitBtn.querySelector('span').textContent = 'Evaluate Risk';
        }
    });

    function displayResults(data) {
        placeholderResult.style.display = 'none';
        resultContent.classList.remove('hidden');

        const probPercent = (data.default_probability * 100).toFixed(2);
        
        // Populate values
        probValue.textContent = `${probPercent}%`;
        thresholdValue.textContent = data.threshold.toFixed(4);
        scorePercentage.textContent = `${probPercent}%`;
        progressBar.style.width = `${Math.min(probPercent, 100)}%`;

        // Style based on Result ("High Risk" vs "Low Risk")
        if (data.Result === 'High Risk') {
            riskBadge.className = 'risk-badge high';
            riskText.textContent = 'High Credit Risk (Default Likely)';
            progressBar.style.backgroundColor = '#ef4444';
            recommendationText.textContent = 'Application exceeds acceptable default thresholds. Recommended for manual review or rejection.';
        } else {
            riskBadge.className = 'risk-badge low';
            riskText.textContent = 'Low Credit Risk (Safe)';
            progressBar.style.backgroundColor = '#22c55e';
            recommendationText.textContent = 'Applicant falls within safe risk parameters. Eligible for automated approval.';
        }
    }
});