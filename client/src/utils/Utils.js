const numberToMonth = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
}

export function getAllowedYears() {
    const date = new Date()
    const currentYear = date.getFullYear()
    let years = []
    for (let year = 2000; year <= currentYear; year++) {
        years.push({value: year, label: `${year}`})
    }
    return years
}

export function getMonthFromNumber(month) {
    return numberToMonth[month]
}

export function getMonths() {
    let months = []
    for (let month = 0; month <= 11; month++) {
        months.push({value: month, label: getMonthFromNumber(month)})
    }
    return months
}

export function getCurrentYear() {
    return new Date().getFullYear()

}

export function getCurrentMonth() {
    return (new Date().getMonth())
}

export async function getErrorResponse(response) {
    let errorMessage = `Error ${response.status.toString()}`
    if (response.status >= 400 && response.status < 500) {
        const responseJson = await response.json()
        if (responseJson.errors) {
            errorMessage = responseJson.errors[0].msg
        } else if (responseJson.errorMessage) {
            errorMessage = responseJson.errorMessage
        } else if (responseJson.error) {
            errorMessage = responseJson.error
        }
    }
    return {errorMessage: errorMessage, statusCode: response.status}
}