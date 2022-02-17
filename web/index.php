<?php 
  error_reporting(0); // Fuck warnings
  require 'functions.php';
  
  if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $type = $_POST["type"];
    
    if ($type == "edit") {
      $id = $_POST["id"];
      $name = $_POST["product"];
      $quantity = $_POST["quantity"];
      editStock($id, $name, $quantity);
    }
    if ($type == "new") {
      $name = $_POST["product"];
      $quantity = $_POST["quantity"];
      addStock($name, $quantity);
    }
    if($type == "markdone"){
      $price = $_POST["price"];
      $id = $_POST["id"];
      markDone($id, $price);
    }
    if($type == "archive"){
      $id = $_POST["id"];
      archiveMessage($id);
    }
    if($type == "markpending"){
      $id = $_POST["id"];
      markPending($id);
    }
    if($type == "markdeclined"){
      $id = $_POST["id"];
      $product = $_POST['product'];
      $amount = $_POST['amount'];
      markDeclined($id);
      addtoStock($product, $amount);
    }
    if($type == "deleteproduct"){
      $id = $_POST["id"];
      deleteProduct($id);
    }
    if($type == "acceptuser"){
      $id = $_POST["id"];
      setUser($id, 1);
    }
    if($type == "declineuser"){
      $id = $_POST["id"];
      setUser($id, 2);
    }
    echo "<meta http-equiv='refresh' content='0'>";
  }
?>
<!DOCTYPE html>
<html>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto" rel="stylesheet"> 
  <link rel="stylesheet" href="css/style.css">
  <title>Telegram bot dashboard</title>
</head>
<body>
  
  <!-- Nieuwe orders -->
  <h2>Nieuwe orders</h2>
  <table>
    <tr>
      <th>Telegram gebruikersnaam</th>
      <th>Product</th>
      <th>Hoeveelheid</th>
      <th>Orderid</th>
      <th>Datum (YYYY/MM/DD)</th>
      <th>Opties</th>
    </tr>
    <?php getIncomplete() ?>
  </table>
  
  <!-- In behandeling -->
  <h2>In behandeling</h2>
  <table>
    <tr>
      <th>Telegram gebruikersnaam</th>
      <th>Product</th>
      <th>Hoeveelheid</th>
      <th>Orderid</th>
      <th>Datum (YYYY/MM/DD)</th>
      <th>Opties</th>
    </tr>
    <?php getPending() ?>
  </table>

  <!-- Voorraad -->
  <h2>Voorraad</h2>
  <table>
    <tr>
      <th>Product</th>
      <th>Voorraad</th>
      <th>Opties</th>
    </tr>
    <?php getStock(); ?>
    <tr>
    <form action="/index.php" method="post">
      <input type="hidden" name="type" value="new">
      <td> <input type='text' name='product'></td>
      <td> <input type='text' name='quantity'></td>
      <td> <input type="submit" class="button" value="Toevoegen"> </td>
    </form>
    </tr>
    <?php getTotalstock(); ?>
  </table>

  <!-- Nieuwe gebruikers -->
  <h2>Nieuwe gebruikers</h2>
  <table>
    <tr>
      <th>Gebruikersnaam</th>
      <th>Opties</th>
    </tr>
  <?php getNewusers(); ?>
  </table>

  <!-- Berichten -->
  <h2>Berichten:</h2>
  <table>
    <tr>
      <th>Telegram gebruikersnaam</th>
      <th>Bericht</th>
      <th>Datum (YYYY/MM/DD)</th>
      <th>Opties</th>
    </tr>
    <?php getMessages(); ?>
  </table>

  <!-- Oude orders -->
  <h2>Oude orders</h2>
  <table>
    <tr>
      <th>Telegram gebruikersnaam</th>
      <th>Product</th>
      <th>Hoeveelheid</th>
      <th>Prijs stuk </th>
      <th>Totaal prijs</th>
      <th>Orderid</th>
      <th>Datum (YYYY/MM/DD)</th>
      <th>Status</th>
    </tr>
    <?php getComplete(); ?>
  </table>
  <?php
  if($_GET['error']) {
    echo '<script>alert("'. $_GET["error"]. '")</script>';
    echo '<script>window.location.replace("http://'.  $_SERVER['HTTP_HOST'] .'")</script>';
  }
  ?>
</body>
</html>


