<?php

namespace App\Mapbox;

/**
 *
 */
class MapFactory
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
	public function create(): Map
	{
		return new Map($this->token);
	}
}