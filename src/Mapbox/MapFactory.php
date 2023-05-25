<?php

namespace App\Mapbox;

use Symfony\Component\Routing\RouterInterface;

class MapFactory
{
	private string $token;
	private float $westernLimit;
	private float $northernLimit;
	private float $easternLimit;
	private float $southernLimit;
	private string $heatmapDataURL;

	public function __construct(string $key, float $westernLimit, float $northernLimit, float $easternLimit, float $southernLimit, RouterInterface $router)
	{
		$this->token = $key;
		$this->westernLimit = $westernLimit;
		$this->northernLimit = $northernLimit;
		$this->easternLimit = $easternLimit;
		$this->southernLimit = $southernLimit;
		$this->heatmapDataURL = $router->generate('data');
	}

	public function create(): Map
	{
		return new Map($this->token, $this->westernLimit, $this->northernLimit, $this->easternLimit, $this->southernLimit, $this->heatmapDataURL);
	}
}