export const contactEmails = {
    brand: "Rock Experience",
    owner: {
        subject: (name: string) => `Nuevo mensaje de ${name} desde el formulario`,
        heading: "Nuevo mensaje desde \"Quiero participar\"",
        intro: "Alguien llenó el formulario de contacto de la landing. Puedes responder directamente a este correo.",
        labels: {
            name: "Nombre",
            email: "Correo",
            phone: "Teléfono",
            company: "Empresa",
            message: "Mensaje",
        },
        emptyValue: "No indicada",
    },
    confirmation: {
        subject: "Recibimos tu mensaje | Rock Experience",
        greeting: (name: string) => `Hola, ${name}:`,
        body: "Tu mensaje se envió con éxito. Gracias por escribirnos; nuestro equipo lo revisará y te responderemos pronto.",
        summaryTitle: "Esto es lo que nos enviaste:",
        signature: "El equipo de Rock Experience",
    },
};
