<?php

namespace App\Data;

use App\Data\Exception\EncodeException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class DataResponse
{
	public AbstractCollection $data;
	public string $contentType = 'application/text';
	public ?string $fromDate = null;
	public ?string $toDate = null;
	public string $error;
	public int $statusCode = Response::HTTP_OK;

	public function __construct(
		AbstractCollection $data,
		string $contentType = 'application/text',
		?string $fromDate = null,
		?string $toDate = null,
		string $error = '',
		int $statusCode = Response::HTTP_OK,
	)
	{
		$this->data = $data;
		$this->contentType = $contentType;
		$this->fromDate = $fromDate;
		$this->toDate = $toDate;
		$this->error = $error;
		$this->statusCode = $statusCode;
	}

	/**
	 * @throws EncodeException
	 */
	public function makeResponse(): Response
	{
		if ($this->hasError()) {
			return new Response($this->error, $this->statusCode);
		}

		$content = json_encode([
			'data'		=> $this->data,
			'fromDate'	=> $this->fromDate,
			'toDate'	=> $this->toDate
		]);

		if ($content === false) {
			throw new EncodeException('Failed to encode the data.');
		}

		$response = new JsonResponse();
		$response->headers->set('Content-Type', $this->contentType);
		$response->setContent($content);

		return $response;
	}

	public function hasError(): bool
	{
		return !empty($this->error) || $this->statusCode !== Response::HTTP_OK;
	}
}