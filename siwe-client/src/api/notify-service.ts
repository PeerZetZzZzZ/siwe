import { Notify } from 'quasar';

export const showSuccessMessage = (message: string) => {
    Notify.create({
        message: message,
        color: 'positive',
        icon: 'check',
        position: 'top',
    });

}

export const showErrorMessage = (message: string) => {
    Notify.create({
        message: message,
        color: 'negative',
        icon: 'warning',
        position: 'top',
    });
}
