<?php
session_start();

class CaptchaSecurityImages {
    private $font = 'monofont.ttf';

    public function __construct($width = 120, $height = 40, $characters = 6) {
        if (!file_exists($this->font)) {
            die('Errore: Font non trovato!');
        }

        $code = $this->generateCode($characters);
        $_SESSION['security_code'] = $code;

        $image = imagecreatetruecolor($width, $height);
        
        // Colori
        $background_color = imagecolorallocate($image, 255, 255, 255);
        $text_color = imagecolorallocate($image, 0, 0, 0);
        $noise_color = imagecolorallocate($image, 100, 100, 100);

        // Sfondo
        imagefilledrectangle($image, 0, 0, $width, $height, $background_color);

        // Rumore con punti
        for ($i = 0; $i < ($width * $height) / 3; $i++) {
            imagesetpixel($image, random_int(0, $width), random_int(0, $height), $noise_color);
        }

        // Rumore con linee
        for ($i = 0; $i < ($width * $height) / 150; $i++) {
            imageline($image, random_int(0, $width), random_int(0, $height), random_int(0, $width), random_int(0, $height), $noise_color);
        }

        // Imposta font size e posizione del testo
        $font_size = $height * 0.7;
        $textbox = imagettfbbox($font_size, 0, $this->font, $code);
        $x = ($width - ($textbox[2] - $textbox[0])) / 2;
        $y = ($height - ($textbox[1] - $textbox[7])) / 2 + $font_size / 2;

        // Testo CAPTCHA
        imagettftext($image, $font_size, 0, $x, $y, $text_color, $this->font, $code);

        // Output come PNG per maggiore qualità
        header('Content-Type: image/png');
        imagepng($image);
        imagedestroy($image);
    }

    private function generateCode($characters) {
        $possible = '23456789bcdfghjkmnpqrstvwxyz';
        $code = '';
        for ($i = 0; $i < $characters; $i++) {
            $code .= $possible[random_int(0, strlen($possible) - 1)];
        }
        return $code;
    }
}

// Parametri opzionali
$width = isset($_GET['width']) ? (int)$_GET['width'] : 120;
$height = isset($_GET['height']) ? (int)$_GET['height'] : 40;
$characters = isset($_GET['characters']) && $_GET['characters'] > 1 ? (int)$_GET['characters'] : 6;

// Istanzia il CAPTCHA
new CaptchaSecurityImages($width, $height, $characters);
?>
