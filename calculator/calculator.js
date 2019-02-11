function InitializeLocalStorage() {
    localStorage.setItem('errors', JSON.stringify({
        salary: false,
        years: false,
        days: false,
    }));
    localStorage.setItem('counting', false)
}
function weAreCounting() {
    return JSON.parse(localStorage.getItem('counting'));    
}
function getFormdata() {
    return {
        salary: document.querySelector('#salary').value,
        days: document.querySelector('#days').value,
        years: document.querySelector('#years').value,
    }
}
function isAValidForm() {
    let form = getFormdata();
    let errors = JSON.parse(localStorage.getItem('errors'));
    let isValid = true;

    errors.salary = errors.years = errors.days = false;
    if (form.salary <= 0) {
        isValid = false;
        errors.salary = true;
    }
    if (form.years < 0 || form.years >=35 ) {
        isValid = false;
        errors.years = true;
    }
    if ((form.days <= 0 || form.days >=365) && (form.years < 1) ) {
        isValid = false;
        errors.days = true;
    }
    localStorage.setItem('errors', JSON.stringify(errors));
    if (isValid == false) {
        markAssError()
        return false;
    }
    cleanErrors()
    return form;
}
function markAssError() {
    let errors = JSON.parse(localStorage.getItem('errors'));
    let errorTemplate = '';
    cleanErrors();

    if (errors.salary == true) {
        errorTemplate += `<small>Salary must be greater than 0.</small> <br>`; 
        document.querySelector('#salary').classList.add('is-error');
    }
    if (errors.years == true) {
        errorTemplate += `<small>years must be greater than 0 and lower than 35.</small><br>`; 
        document.querySelector('#years').classList.add('is-error');
    }
    if (errors.days == true) {
        errorTemplate += `<small>Days  must be greater than 0 and less than 365</small>`; 
        document.querySelector('#days').classList.add('is-error');
    }
    document.querySelector('#secret-message').classList.remove('secret-message');
    document.querySelector('#secret-message').classList.add('error-message');
    document.querySelector('#bonusText').innerHTML = '$0.00';

    document.querySelector('#reason').innerHTML = (errorTemplate);
}
function cleanErrors() {
    document.querySelector('#salary').classList.remove('is-error');
    document.querySelector('#years').classList.remove('is-error');
    document.querySelector('#days').classList.remove('is-error');

    document.querySelector('#secret-message').classList.remove('error-message');
    document.querySelector('#secret-message').classList.add('secret-message');    
}
function salaryOfXdays(days,salary) {
    return (salary * days) / 30;
}
function getBonus(form) {
    let bonusDays = 0; 
    let applyDivision = false;

    if (form.years < 1) {
        applyDivision = true;
        bonusDays = 15;
    }
    if (form.years >= 1 && form.years < 3) {
        bonusDays = 15;
    }
    if (form.years >= 3 && form.years <= 10) {
        bonusDays = 19;
    }
    if (form.years >= 10) {
        bonusDays = 21;
    }
    let bonus = salaryOfXdays(bonusDays, form.salary);
    if (applyDivision) {
        bonus = (form.days * bonus) / 365;
    }
    return {bonus, bonusDays};
}

function calculateBonus() {
    if (!weAreCounting()) {
        let form = isAValidForm(); // it is either { salary, days, years } or false
        let submit = document.querySelector('#submit');
        let bonusInputValue = parseInt(document.querySelector('#bonusInput').value);
        let dollarFormater =  new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          });
        if (form !== false) {
            let bonus = getBonus(form)
            // lets animate our bonus
            let timer = setInterval(function() {

                submit.classList.add('busy');
                localStorage.setItem('counting',true);

                bonusInputValue += 2;
                document.querySelector('#bonusText').innerHTML = dollarFormater.format(bonusInputValue);
                if (bonusInputValue >= bonus.bonus) {

                    localStorage.setItem('counting', false);
                    submit.classList.remove('busy')
                    document.querySelector('#bonusText').innerHTML = dollarFormater.format(bonus.bonus);
                    clearInterval(timer);
                }
            }, 5);
        }
    }
}

InitializeLocalStorage()