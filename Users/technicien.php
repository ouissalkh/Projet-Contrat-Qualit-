<?php
$isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
          strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';

$servername = "10.10.10.55";
$dbname = "indicateur";
$db_username = "cq_projet";
$db_password = "Z9#k*E)dl*o(0I";

$conn = new mysqli($servername, $db_username, $db_password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$search = '';
$filterActif = '';
$techniciens = [];

if (!empty($_GET['search'])) {
    $search = trim($_GET['search']);
}

if (!empty($_GET['actif'])) {
    $filterActif = $_GET['actif'];
}

$fields_res = $conn->query("SHOW COLUMNS FROM liste_techniciens");
$conditions = [];

if ($search !== '') {
    while ($field = $fields_res->fetch_assoc()) {
        $col = $field['Field'];
        if ($col !== 'Actif') {
            $conditions[] = "`$col` LIKE '%" . $conn->real_escape_string($search) . "%'";
        }
    }
}

if ($filterActif === 'vrai') {
    $conditions[] = "`Actif` = 'vrai'";
} elseif ($filterActif === 'faux') {
    $conditions[] = "`Actif` = 'faux'";
}

$sql = "SELECT * FROM liste_techniciens";
if (count($conditions) > 0) {
    $sql .= " WHERE " . implode(" OR ", $conditions);
}

$result = $conn->query($sql);
if (!$result) {
    die("Erreur SQL: " . $conn->error);
}

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $techniciens[] = $row;
    }
}

$conn->close();

// Si c'est une requête AJAX, on capture le HTML partiel seulement
if ($isAjax) ob_start();
?>

<?php if (!$isAjax): ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Liste des techniciens</title>
    <link rel="icon" type="image/png" href="image/logo.png">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css"> <!-- si tu as un CSS global -->
</head>
<body>
    <!-- Bouton retour fixé hors container -->
    <a href="home.php" class="btn-retour-fixed" title="Retour">
        <i class="fas fa-arrow-left"></i> Retour
    </a>
<?php endif; ?>

<div class="container">
    <h2>Liste des techniciens</h2>

    <form method="get" class="filtre-form">
        <input type="text" name="search" value="<?= htmlspecialchars($search) ?>" placeholder="Rechercher...">

        <div class="form-filter-wrapper">
            <select name="actif" onchange="this.form.submit()">
                <option value="" <?= $filterActif === '' ? 'selected' : '' ?>>Filtre</option>
                <option value="vrai" <?= $filterActif === 'vrai' ? 'selected' : '' ?>>Vrai</option>
                <option value="faux" <?= $filterActif === 'faux' ? 'selected' : '' ?>>Faux</option>
            </select>
        </div>

        <button type="submit" class="btn"><i class="fas fa-search"></i></button>
        <a href="<?= basename($_SERVER['PHP_SELF']) ?>" class="btn" title="Rafraîchir"><i class="fas fa-sync"></i></a>
    </form>

    <div id="resultat-techniciens">
        <table>
            <thead>
                <tr>
                    <?php if (!empty($techniciens)): ?>
                        <?php foreach (array_keys($techniciens[0]) as $col): ?>
                            <th><?= htmlspecialchars($col) ?></th>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <th>Aucune donnée</th>
                    <?php endif; ?>
                </tr>
            </thead>
            <tbody>
                <?php if (!empty($techniciens)): ?>
                    <?php foreach ($techniciens as $row): ?>
                        <tr>
                            <?php foreach ($row as $value): ?>
                                <td><?= htmlspecialchars($value) ?></td>
                            <?php endforeach; ?>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="100%" class="no-result">Aucun utilisateur trouvé</td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<?php if (!$isAjax): ?>
</body>
</html>
<?php endif; ?>

<?php
// Si c'était une requête AJAX, afficher uniquement le contenu capturé
if ($isAjax) {
    $output = ob_get_clean();
    echo $output;
    exit;
}
?>