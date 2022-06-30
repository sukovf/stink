<?php

namespace App\Mapbox;

/**
 *
 */
class Map
{
	/** @var string */
	private string $token;

	/**
	 *
	 */
	public function __construct(string $key)
	{
		$this->token = $key;
	}

	/**
	 *
	 */
	public function getToken(): string
	{
		return $this->token;
	}
}