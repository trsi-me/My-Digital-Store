<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "My_Digital_Store");

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'فشل الاتصال بقاعدة البيانات']);
    exit; }

// الدفع بسداد أو العملات الرقمية
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars(trim($_POST['email'] ?? ''), ENT_QUOTES, 'UTF-8');
    $payment_method = htmlspecialchars(trim($_POST['payment_method'] ?? ''), ENT_QUOTES, 'UTF-8');
    $amount = htmlspecialchars(trim($_POST['amount'] ?? ''), ENT_QUOTES, 'UTF-8');
    $transfer = $_FILES['transfer'] ?? null;

    if (empty($name) || empty($email) || empty($payment_method) || !$transfer) {
        echo json_encode(['success' => false, 'message' => 'الرجاء إدخال جميع البيانات وإرفاق صورة']);
        exit; }

    // التحقق من نوع الملف
    $allowed_extensions = ['jpeg', 'jpg', 'png', 'webp', 'pdf'];
    $file_extension = strtolower(pathinfo($transfer['name'], PATHINFO_EXTENSION));
    if (!in_array($file_extension, $allowed_extensions)) {
        echo json_encode(['success' => false, 'message' => 'نوع الملف غير مدعوم']);
        exit; }

    $upload_dir = realpath(__DIR__ . '/../uploads') . '/';
    $file_name = time() . '_' . basename($transfer['name']);
    $target_file = $upload_dir . $file_name;

    if (!move_uploaded_file($transfer['tmp_name'], $target_file)) {
        echo json_encode(['success' => false, 'message' => 'فشل في رفع الملف']);
        exit; }

    $relative_file_path = '../uploads/' . $file_name;
    $stmt = $conn->prepare("INSERT INTO payments (name, email, payment_method, amount, transfer) VALUES (?, ?, ?, ?, ?)");

    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'خطأ في الاستعلام: ' . $conn->error]);
        exit; }

    $stmt->bind_param("sssss", $name, $email, $payment_method, $amount, $relative_file_path);

    if ($stmt->execute()) {
        header('Location: thx/index.html');
        exit; } 
    else { echo json_encode(['success' => false, 'message' => 'فشل في حفظ البيانات']); }

    $stmt->close(); }
else { echo json_encode(['success' => false, 'message' => 'طريقة الطلب غير صحيحة']); }

$conn->close();
?>