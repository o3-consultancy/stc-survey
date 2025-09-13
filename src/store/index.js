import { defineStore } from 'pinia'

export const useSurveyStore = defineStore('survey', {
    state: () => ({
        lang: 'en', // 'en' | 'ar'
        name: '',
        company: '',
        phoneCountryCode: '+971',
        phoneNumber: '',
        phoneValidated: false,

        interest: '', // "Smart Finance" | "Bueniss Portal Service" | "None"
        thoughtsOnStc: '',

        qrId: '',
        submitting: false,
    }),
    actions: {
        resetAll() {
            this.lang = 'en'
            this.name = ''
            this.company = ''
            this.phoneCountryCode = '+966'
            this.phoneNumber = ''
            this.phoneValidated = false
            this.interest = ''
            this.thoughtsOnStc = ''
            this.qrId = ''
            this.submitting = false
        },
        setLang(l) { this.lang = l },
    }
})
