<?php

namespace App\Mapbox;

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class Twig extends AbstractExtension
{
	private Environment $twig;

	public function __construct(Environment $twig)
	{
		$this->twig = $twig;
	}

	public function getFunctions(): array
	{
		return [
			new TwigFunction('mapbox', [$this, 'mapbox'], ['is_safe' => ['html']])
		];
	}

	/**
	 * @throws RuntimeError
	 * @throws SyntaxError
	 * @throws LoaderError
	 */
	public function mapbox(Map $map): string
	{
		return $this->twig->render('Mapbox/map.html.twig', [
			'map' => $map
		]);
	}
}