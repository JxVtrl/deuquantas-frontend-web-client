export const timeFormatter = (value: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
        hour: 'numeric',
        minute: 'numeric',
    }).format(new Date(value));
}