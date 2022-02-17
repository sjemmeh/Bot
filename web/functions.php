<?php

function getIncomplete() {
    require 'config.php';
    $conn = mysqli_connect($servername, $username, $password, $dbname);
    if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT * FROM orders WHERE complete = 'verwerken'";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
        // output data of each row
        while($row = mysqli_fetch_assoc($result)) {
            echo "<tr>";
            echo "<td><a href='https://t.me/" . $row["username"] . "'> " . $row["username"] . " </a></td>";
            echo "<td>" . $row["orderinfo"] . "</td>";
            echo "<td>" . $row["amount"] . "</td>";
            echo "<td>" . $row["ordernumber"] . "</td>";
            echo "<td>" . $row["date"] . "</td>";
            echo "<td><form action='/index.php' method='post'><input type='hidden' name='type' value='markpending'><input type='hidden' name='id' value='" . $row['id'] . "'><input type='hidden' name='amount' value='" . $row['amount'] . "'><input type='hidden' name='product' value='" . $row['orderinfo'] . "'><input type='submit' class='button' value='Aannemen'></form><form action='/index.php' method='post'><input type='hidden' name='type' value='markdeclined'><input type='hidden' name='id' value='" . $row['id'] . "'><input type='hidden' name='product' value='" . $row['orderinfo'] . "'><input type='hidden' name='amount' value='" . $row['amount'] . "'><input type='submit' class='button' value='Afwijzen'></form></td>";
            echo "</tr>";    
        }
    }
    mysqli_close($conn);
}

function getComplete() {
    require 'config.php';

    $conn = mysqli_connect($servername, $username, $password, $dbname);
    if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT * FROM orders WHERE complete = 'afgerond' OR complete = 'geweigerd' ";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
        $totalprice = 0;
        $totalsold = 0;
        while($row = mysqli_fetch_assoc($result)) {
            $unitprice = $row["price"] * $row["amount"];
            $totalprice = $totalprice+$unitprice;
            $totalsold = $totalsold+$row["amount"];
            echo "<tr>";
            echo "<td><a href='https://t.me/" . $row["username"] . "'> " . $row["username"] . " </a></td>";
            echo "<td>" . $row["orderinfo"] . "</td>";
            echo "<td>" . $row["amount"] . "</td>";
            echo "<td>&euro; " . $row["price"] . "</td>";
            echo "<td>&euro; " . $unitprice . "</td>";
            echo "<td>" . $row["ordernumber"] . "</td>";
            echo "<td>" . $row["date"] . "</td>";
            echo "<td>" . $row["complete"] . "</td>";
            echo "</tr>";    
        }
        echo "<tr>";
        echo "<td></td>";
        echo "<td style='text-align:right; font-size:80%;'><b>Totaal:</b></td>";
        echo "<td style='font-size:80%;'>" . $totalsold . "</td>";
        echo "<td style='text-align:right; font-size:80%;'><b>Totaal:</b></td>";
        echo "<td style='font-size:80%;'>&euro; " . $totalprice . "</td>";
        echo "<td></td>";
        echo "<td></td>";
        echo "<td></td>";
        echo "</tr>";  
    }
    mysqli_close($conn);
}

function getPending() {
    require 'config.php';

    $conn = mysqli_connect($servername, $username, $password, $dbname);
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    
    $sql = "SELECT * FROM orders WHERE complete = 'in behandeling'";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            echo "<tr>";
            echo "<td><a href='https://t.me/" . $row["username"] . "'> " . $row["username"] . " </a></td>";
            echo "<td>" . $row["orderinfo"] . "</td>";
            echo "<td>" . $row["amount"] . "</td>";
            echo "<td>" . $row["ordernumber"] . "</td>";
            echo "<td>" . $row["date"] . "</td>";
            echo "<td><form action='/index.php' method='post'><input type='hidden' name='type' value='markdone'><input type='hidden' name='product' value='". $row["orderinfo"] ."'><input type='hidden' name='amount' value='". $row["amount"] ."'><input type='hidden' name='id' value='" . $row['id'] . "'><input type='text' name='price' placeholder='stukprijs'><input type='submit' class='button' value='Afronden'></form></td>";
            echo "</tr>";    
            
        }
    }
    mysqli_close($conn);
}
function getMessages() {
    require 'config.php';

    $conn = mysqli_connect($servername, $username, $password, $dbname);
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT * FROM messages WHERE archived = 0";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            echo "<tr>";
            echo "<td><a href='https://t.me/" . $row["username"] . "'> " . $row["username"] . " </a></td>";
            echo "<td>" . $row["message"] . "</td>";
            echo "<td>" . $row["date"] . "</td>";
            echo "<td><form action='/index.php' method='post'><input type='hidden' name='type' value='archive'><input type='hidden' name='id' value='" . $row['id'] . "'><input type='submit' class='button' value='Archiveer'></form></td>";
            echo "</tr>";    

        }
    }
mysqli_close($conn);
}


function markDone($id, $price) {
    require 'config.php';

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "UPDATE orders SET complete='afgerond', price=$price WHERE id=$id";
    $conn->query($sql);
    $conn->close();
}

function checkEnoughStock($product, $amount) {
    require 'config.php';

    $currentstock = 0;
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "SELECT quantity FROM products WHERE product='" . $product . "'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
      while($row = $result->fetch_assoc()) {
        $currentstock = $row["quantity"];
      }
    }
    $conn->close();
    $updatedstock = $currentstock-$amount;
    if ($updatedstock > 0) { 
        return true;
    } else {
        return false;
    }
}

function markPending($id) {
    require 'config.php';

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "UPDATE orders SET complete='in behandeling' WHERE id=$id";
    $conn->query($sql);
    $conn->close();
}

function markDeclined($id) {
    require 'config.php';

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "UPDATE orders SET complete='geweigerd', amount=0 WHERE id=$id";
    $conn->query($sql);
    $conn->close();
    
}
function addtoStock($product, $amount) {
    require 'config.php';

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $sql = "UPDATE products SET quantity = quantity + $amount WHERE product='$product'";
    $conn->query($sql);
    $conn->close();
}
function archiveMessage($id) {
    require 'config.php';

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "UPDATE messages SET archived='1' WHERE id=$id";
    $conn->query($sql);
    $conn->close();
}

function getStock() {
    require 'config.php';

    $conn = mysqli_connect($servername, $username, $password, $dbname);
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT * FROM products";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {    
            echo "<tr>";
            echo '<form action="/index.php" method="post">';
            echo '<input type="hidden" name="type" value="edit">';
            echo '<input type="hidden" name="id" value="'. $row["id"] . '">';
            echo "<td> <input type='text' name='product' value='" . $row["product"] . "'></td>";
            echo "<td> <input type='text' name='quantity' value='" . $row["quantity"] . "'></td>";
            echo '<td> <input type="submit" class="button" value="Bijwerken"></form>';
            echo "<form action='/index.php' method='post'><input type='hidden' name='type' value='deleteproduct'><input type='hidden' name='id' value='" . $row['id'] . "'><input type='submit' class='button' value='Verwijder'></form></td>";
            echo "</tr>";    

        }
    }
    mysqli_close($conn);
}

function getTotalstock() {
    require 'config.php';

    $conn = mysqli_connect($servername, $username, $password, $dbname);
    $totalstock = 0;
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT * FROM products";
    $result = mysqli_query($conn, $sql); 
    if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            $totalstock = $totalstock+$row["quantity"];
        }
        echo "<tr>";
        echo "<td style='text-align:right; font-size:80%'><b>Totale voorraad:</b></td>";
        echo "<td style='font-size:80%'>" .$totalstock . "</td>";    
        echo "<td></td>";
        echo "</tr>";
    }
    mysqli_close($conn);
}

function editStock($id, $name, $amount) {
    require 'config.php';

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "UPDATE products SET product='" . $name . "', quantity='" . $amount . "' WHERE id=" . $id;
    $conn->query($sql);
    $conn->close();

}
function deleteProduct($id) { 
    require 'config.php';

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    $sql = "DELETE FROM products WHERE id=" . $id;
    $conn->query($sql);
    $conn->close();

}
function addStock($name, $amount) {
    require 'config.php';

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO products (product, quantity) VALUES ('". $name ."', '". $amount ."')";
    $conn->query($sql);
    $conn->close();
}

function getNewusers() {
    require 'config.php';

    $conn = mysqli_connect($servername, $username, $password, $dbname);
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $sql = "SELECT * FROM authorized_users WHERE authorized=0";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0) {
        while($row = mysqli_fetch_assoc($result)) {
            echo "<tr>";
            echo "<td>" . $row["telegram_username"] . "</td>";
            echo "<td><form action='/index.php' method='post'><input type='hidden' name='type' value='acceptuser'><input type='hidden' name='id' value='" . $row['telegram_chatid'] . "'><input type='submit' class='button' value='Accepteren'></form><form action='/index.php' method='post'><input type='hidden' name='type' value='declineuser'><input type='hidden' name='id' value='" . $row['telegram_chatid'] . "'><input type='submit' class='button' value='Afwijzen'></form></td>";
            echo "</tr>";   
        }
    }
    mysqli_close($conn);
}

function setUser($id, $status) {
    require 'config.php';

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "UPDATE authorized_users SET authorized=". $status . " WHERE telegram_chatid=" . $id;
    $conn->query($sql);
    $conn->close();
}

?>