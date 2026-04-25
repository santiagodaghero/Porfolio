<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 1. Capturar datos del formulario
    $nombre = htmlspecialchars($_POST["nombre"]);
    $email = htmlspecialchars($_POST["email"]);
    $asunto = htmlspecialchars($_POST["asunto"]);
    $mensaje = htmlspecialchars($_POST["mensaje"]);

    // 2. Email al que vas a recibir los mensajes
    $destinatario = "lic.dagherosantiago@gmail.com"; // ← CAMBIÁ ESTO

    // 3. Armar el contenido del mail
    $contenido = "Nombre: $nombre\n";
    $contenido .= "Email: $email\n";
    $contenido .= "Asunto: $asunto\n\n";
    $contenido .= "Mensaje:\n$mensaje\n";

    // 4. Headers (MUY IMPORTANTE)
    $headers = "From: $email";

    // 5. Enviar mail
    if (mail($destinatario, $asunto, $contenido, $headers)) {
        echo "Mensaje enviado correctamente";
    } else {
        echo "Error al enviar el mensaje";
    }
}
?>