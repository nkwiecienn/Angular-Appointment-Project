export interface Reservation {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    length: number;
    type: "konsultacja" | "badanie" | "wizyta kontrolna" | "recepta" | "inny";
    patientName: string;
    patientSurname: string;
    gender: 'kobieta' | 'mężczyzna' | 'inny';
    age: number;
    details?: string;
    isCanceled: boolean;
    isReserved: boolean;
    userName?: string;
}
