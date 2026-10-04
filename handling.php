<?php
header('Content-Type: application/json');

$conn = new mysqli("localhost", "root", "", "My_Digital_Store");

if ($conn->connect_error) { die(json_encode(['success' => false, 'message' => '!فشل الاتصال بقاعدة البيانات'])); }

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!isset($_POST['name'], $_POST['review'], $_POST['rating'])) {
        echo json_encode(['success' => false, 'message' => 'البيانات غير مكتملة']);
        exit(); }

    $name = htmlspecialchars(trim($_POST['name']));
    $review = htmlspecialchars(trim($_POST['review']));
    $rating = (int)$_POST['rating'];
    $avatarPath = 'uploads/default.png';

    $checkSql = "SELECT COUNT(*) FROM reviews 
    WHERE name = ? AND review = ? 
    AND rating = ? AND avatar = ?";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("ssis", $name, $review, $rating, $avatarPath);
    $checkStmt->execute();
    $checkStmt->bind_result($count);
    $checkStmt->fetch();
    $checkStmt->close();

    if ($count > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'هذه المراجعة مضافة مسبقا' ]);
    exit(); }

    if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $allowed_extensions = ['jpg', 'jpeg', 'png', 'webp'];
        $avatarTmpPath = $_FILES['avatar']['tmp_name'];
        $avatarOriginalName = basename($_FILES['avatar']['name']);
        $fileExtension = strtolower(pathinfo($avatarOriginalName, PATHINFO_EXTENSION));
    
        if (!in_array($fileExtension, $allowed_extensions)) {
            echo json_encode(['success' => false, 'message' => 'صيغة الملف غير مدعومة']);
            exit(); }

        $avatarName = uniqid('avatar_', true) . '.' . $fileExtension;
        $avatarPath = 'uploads/' . $avatarName;
    
        if (!move_uploaded_file($avatarTmpPath, $avatarPath)) {
            echo json_encode(['success' => false, 'message' => 'فشل في رفع الصورة']);
            exit(); }}
    
    $stmt = $conn->prepare("INSERT INTO reviews (name, review, rating, avatar) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssis", $name, $review, $rating, $avatarPath);

    if ($stmt->execute()) { echo json_encode(['success' => true, 'message' => 'تم إضافة المراجعة بنجاح']); }
    else { echo json_encode(['success' => false, 'message' => 'فشل في إضافة المراجعة']); }

    $stmt->close();
    exit(); }

$result = $conn->query("SELECT * FROM reviews ORDER BY created_at ASC");

$total_reviews = $conn->query("SELECT COUNT(*) as count FROM reviews")->fetch_assoc()['count'];
$total_reviews += 1;

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = [
        'id' => $row['id'],
        'name' => htmlspecialchars($row['name']),
        'review' => htmlspecialchars($row['review']),
        'rating' => (int)$row['rating'],
        'avatar' => htmlspecialchars($row['avatar']),
        'created_at' => date("Y/m/d", strtotime($row['created_at']))]; }

echo json_encode(['total' => $total_reviews, 'reviews' => $reviews]);

$conn->close();
?>