<?php
ini_set('display_errors', 1);

include 'login.php';

if($_POST['action'] == 'add') {
	try 
	{
		$name = (isset($_POST['name']) ? $_POST['name'] : null);
		$parentID = (isset($_POST['parentID']) ? $_POST['parentID'] : null);

		$sql = "INSERT INTO skills (SkillID, Name, ParentID) VALUES(DEFAULT, '$name', $parentID)";
			
		// Prepare statement
		$stmt = $conn->prepare($sql);
		
		//execute the query
		$stmt->execute();

		// echo a message to say the INSERT succeeded
		echo $stmt->rowCount() . " records INSERTED successfully";
	}
	catch(PDOException $e)
	{
		echo $sql . "<br>" . $e->getMessage();
	}
	
	$conn = null;
}

if($_POST['action'] == 'remove') {
	try 
	{

		$skillIDArray = (isset($_POST['skillIDArray']) ? $_POST['skillIDArray'] : null);

		$skillIDs = join("','", $skillIDArray);

		$sql = "DELETE FROM skills WHERE skillID in ('$skillIDs')";
				
		// Prepare statement
		$stmt = $conn->prepare($sql);
		
		//execute the query
		$stmt->execute();

		// echo a message to say the DELETE succeeded
		echo $stmt->rowCount() . " records DELETED successfully";
	}
	catch(PDOException $e)
	{
		echo $sql . "<br>" . $e->getMessage();
	}
	
	$conn = null;
}

if($_POST['action'] == 'edit') {
	try 
	{

		$name = (isset($_POST['name']) ? $_POST['name'] : null);
		$skillID = (isset($_POST['skillID']) ? $_POST['skillID'] : null);

		$sql = "UPDATE skills SET name='$name' WHERE skillID=$skillID";
				
		// Prepare statement
		$stmt = $conn->prepare($sql);
		
		//execute the query
		$stmt->execute();

		// echo a message to say the UPDATE succeeded
		echo $stmt->rowCount() . " records UPDATED successfully";
	}
	catch(PDOException $e)
	{
		echo $sql . "<br>" . $e->getMessage();
	}
	
	$conn = null;
}
?>
