<?php

namespace App\Data;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 *
 */
class DataResponse
{
	/** @var string */
	public string $error;

	/** @var int */
	public int $statusCode = Response::HTTP_OK;

	/** @var string */
	public string $contentType = 'application/text';

	/** @var array */
	public array $data;

	/** @var string|null */
	public ?string $fromDate = null;

	/** @var string|null */
	public ?string $toDate = null;

	/**
	 *
	 */
	public function __construct(
		string $error = '',
		int $statusCode = Response::HTTP_OK,
		string $contentType = 'application/text',
		array $data = [],
		?string $fromDate = null,
		?string $toDate = null)
	{
		$this->error = $error;
		$this->statusCode = $statusCode;
		$this->contentType = $contentType;
		$this->data = $data;
		$this->fromDate = $fromDate;
		$this->toDate = $toDate;
	}

	/**
	 *
	 */
	public function makeResponse(): Response
	{
		if (empty($this->error) && $this->statusCode === Response::HTTP_OK) {
			$response = new JsonResponse();
			$response->headers->set('Content-Type', $this->contentType);
			$response->setContent(json_encode([
				'data'		=> $this->data,
				'fromDate'	=> $this->fromDate,
				'toDate'	=> $this->toDate
			]));

			return $response;
		} else {
			return new Response($this->error, $this->statusCode);
		}
	}
}