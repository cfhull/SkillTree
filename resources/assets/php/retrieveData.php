<?php
ini_set('display_errors', 1);
error_reporting("E_ALL");

include 'login.php';

try 
{
		$sql = "SELECT * FROM skills";
		
		// Prepare statement
		$stmt = $conn->prepare($sql);
		
		//execute the query
		$data = $stmt->execute();

		$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

		echo json_encode($data);
}
catch(PDOException $e)
{
	echo $sql . "<br>" . $e->getMessage();
}

$conn = null;

?>
