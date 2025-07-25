<?php
header('Content-Type: application/json');

// Récupération des paramètres
$mois = $_GET['mois'] ?? null;
$annee = $_GET['annee'] ?? null;

if (!$mois || !$annee) {
    echo json_encode(["status" => "error", "message" => "Mois et année requis"]);
    exit;
}

// Connexion à la base de données
$conn = new mysqli("10.10.10.55", "cq_projet", "Z9#k*E)dl*o(0I", "indicateur");
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Erreur connexion"]);
    exit;
}

// Définition des zones et types
$zones = [
    ["zone" => "ZONE A", "type" => "PLP", "id" => "taux_zone_a_plp", "filtre_prise" => ["Prise existante"]],
    ["zone" => "ZONE B", "type" => "PLP", "id" => "taux_zone_b_plp", "filtre_prise" => ["Prise existante"]],
    ["zone" => "ZONE C", "type" => "PLP", "id" => "taux_zone_c_plp", "filtre_prise" => ["Prise existante"]],
    ["zone" => "ZONE A", "type" => "HOTLINE", "id" => "taux_zone_a_hotline", "filtre_prise" => ["HOTLINE"]],
    ["zone" => "ZONE B", "type" => "HOTLINE", "id" => "taux_zone_b_hotline", "filtre_prise" => ["HOTLINE"]],
    ["zone" => "ZONE C", "type" => "HOTLINE", "id" => "taux_zone_c_hotline", "filtre_prise" => ["HOTLINE"]],
    ["zone" => "ZONE A", "type" => "Construction", "id" => "taux_zone_a_construction", "filtre_prise" => ["Prise non-existante", "Prise non-existante (HOTLINE)"]],
    ["zone" => "ZONE B", "type" => "Construction", "id" => "taux_zone_b_construction", "filtre_prise" => ["Prise non-existante", "Prise non-existante (HOTLINE)"]],
    ["zone" => "ZONE C", "type" => "Construction", "id" => "taux_zone_c_construction", "filtre_prise" => ["Prise non-existante", "Prise non-existante (HOTLINE)"]]
];


$tauxResultats = [];

foreach ($zones as $z) {
    $where = " `Zone contrat 2023` = ? AND MONTH(`Date Rdv Racc`) = ? AND YEAR(`Date Rdv Racc`) = ? AND `RANG_RDV (copie)` = 1  AND `TYPE_PRESTATION` != 'PLP_BRASSAGE'";
    $params = [$z['zone'], $mois, $annee];
    $types = "sii";

    if (count($z['filtre_prise']) === 1) {
        $where .= " AND `Statut Prise Cmdacces` = ?";
        $params[] = $z['filtre_prise'][0];
        $types .= "s";
    } else {
        $placeholders = implode(",", array_fill(0, count($z['filtre_prise']), "?"));
        $where .= " AND `Statut Prise Cmdacces` IN ($placeholders)";
        $params = array_merge($params, $z['filtre_prise']);
        $types .= str_repeat("s", count($z['filtre_prise']));
    }


    // Total RDV avec filtre GRP_STATUT_CRINSTALL_MNT IN (...)
    $sql_total = "SELECT COUNT(*) as total FROM `racc - taux de cr ok - 1er rdv` WHERE $where AND `GRP_STATUT_CRINSTALL_MNT` IN ('CR_MNT_DELAI','CR_MNT_NOK','CR_MNT_NOK - MAUVAIS CODE','CR_MNT_OK')";
    $stmt_total = $conn->prepare($sql_total);
    $stmt_total->bind_param($types, ...$params);
    $stmt_total->execute();
    $res_total = $stmt_total->get_result()->fetch_assoc();
    $total = $res_total['total'] ?? 0;
    $stmt_total->close();

    // RDV OK (statut CR_MNT_OK)
    $sql_ok = "SELECT COUNT(*) as ok FROM `racc - taux de cr ok - 1er rdv` WHERE $where AND `GRP_STATUT_CRINSTALL_MNT` = 'CR_MNT_OK'";
    $stmt_ok = $conn->prepare($sql_ok);
    $stmt_ok->bind_param($types, ...$params);
    $stmt_ok->execute();
    $res_ok = $stmt_ok->get_result()->fetch_assoc();
    $ok = $res_ok['ok'] ?? 0;
    $stmt_ok->close();

    $taux = ($total > 0) ? round(($ok / $total) * 100, 2) : 0;

    $tauxResultats[$z['id']] = $taux;
}


// ...calculs des taux 1er RDV...

// Calcul des taux CR OK-HORS RANG 1 par zone
$zonesHorsRang = [
    ["zone" => "ZONE A", "id" => "taux_hors_rang_a"],
    ["zone" => "ZONE B", "id" => "taux_hors_rang_b"],
    ["zone" => "ZONE C", "id" => "taux_hors_rang_c"],
];

foreach ($zonesHorsRang as $z) {
    $where = " `Zone contrat 2023` = ? AND MONTH(`Date Rdv Racc`) = ? AND YEAR(`Date Rdv Racc`) = ? AND `RANG_RDV (copie)` >= 2";
    $params = [$z['zone'], $mois, $annee];
    $types = "sii";

    $sql_total = "SELECT COUNT(*) as total FROM `racc - taux de cr ok - 1er rdv` WHERE $where AND `GRP_STATUT_CRINSTALL_MNT` IN ('CR_MNT_DELAI','CR_MNT_NOK','CR_MNT_NOK - MAUVAIS CODE','CR_MNT_OK')";
    $stmt_total = $conn->prepare($sql_total);
    $stmt_total->bind_param($types, ...$params);
    $stmt_total->execute();
    $res_total = $stmt_total->get_result()->fetch_assoc();
    $total = $res_total['total'] ?? 0;
    $stmt_total->close();

    $sql_ok = "SELECT COUNT(*) as ok FROM `racc - taux de cr ok - 1er rdv` WHERE $where AND `GRP_STATUT_CRINSTALL_MNT` = 'CR_MNT_OK'";
    $stmt_ok = $conn->prepare($sql_ok);
    $stmt_ok->bind_param($types, ...$params);
    $stmt_ok->execute();
    $res_ok = $stmt_ok->get_result()->fetch_assoc();
    $ok = $res_ok['ok'] ?? 0;
    $stmt_ok->close();

    $taux = ($total > 0) ? round(($ok / $total) * 100, 2) : 0;

    $tauxResultats[$z['id']] = $taux;
}
// ... [votre code existant pour les autres calculs] ...

// Calcul du délai de prise du 1er RDV
$sql_delai = "SELECT 
    COUNT(*) as total,
    SUM(`Delais 1er rdv inf 20j`) as dans_delai
FROM `racc - délais de prise du 1er rdv`
WHERE MONTH(`Date Ss`) = ? 
AND YEAR(`Date Ss`) = ?"
AND `Flag précommande ` != `PRECOMMANDE`;

$stmt_delai = $conn->prepare($sql_delai);
$stmt_delai->bind_param("ii", $mois, $annee);
$stmt_delai->execute();
$res_delai = $stmt_delai->get_result()->fetch_assoc();
$stmt_delai->close();

$taux_delai = ($res_delai['total'] > 0) ? round(($res_delai['dans_delai'] / $res_delai['total']) * 100, 2) : 0;
$tauxResultats['delai_prise_1er_rdv'] = $taux_delai;
// Calcul du taux de report
$sql_report = "SELECT 
    COUNT(*) as total_rdv,
    SUM(CASE WHEN `Taux de RDV planifiés N'AYANT PAS eu lieu à la date de planif` = 1 THEN 1 ELSE 0 END) as rdv_reports
FROM `racc - taux de reports de rdv`
WHERE MONTH(`Date Rdv`) = ? 
AND YEAR(`Date Rdv`) = ?";

$stmt_report = $conn->prepare($sql_report);
$stmt_report->bind_param("ii", $mois, $annee);
$stmt_report->execute();
$res_report = $stmt_report->get_result()->fetch_assoc();
$stmt_report->close();

$taux_report = ($res_report['total_rdv'] > 0) ? round(($res_report['rdv_reports'] / $res_report['total_rdv']) * 100, 2) : 0;
$tauxResultats['taux_report'] = $taux_report;

$conn->close();

echo json_encode([
    "status" => "ok",
    "taux" => $tauxResultats
]);


?>