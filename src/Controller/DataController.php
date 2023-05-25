<?php

namespace App\Controller;

use App\Data\Exception\EncodeException;
use App\Data\GeoJson\GeoJsonDataProvider;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DataController extends AbstractController
{
	/**
	 * @Route("/data.geojson", name="data")
	 *
	 * @throws EncodeException
	 */
	public function getData(Request $request, GeoJsonDataProvider $provider): Response
	{
		return
			$provider
				->getData($request)
				->makeResponse();
	}
}