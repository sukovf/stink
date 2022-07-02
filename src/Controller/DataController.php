<?php

namespace App\Controller;

use App\Data\GeoJsonDataProvider;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 *
 */
class DataController extends AbstractController
{
	/**
	 * @Route("/data.geojson", name="data")
	 */
	public function getData(EntityManagerInterface $entityManager): Response
	{
		$dataProvider = new GeoJsonDataProvider($entityManager);
		return $dataProvider->getData();
	}
}