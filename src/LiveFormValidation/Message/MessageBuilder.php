<?php

namespace App\LiveFormValidation\Message;

use Symfony\Contracts\Translation\TranslatorInterface;

/**
 *
 */
class MessageBuilder
{
    /** @var TranslatorInterface */
    private TranslatorInterface $translator;

    /**
     *
     */
    public function __construct(TranslatorInterface $translator)
    {
        $this->translator = $translator;
    }

	/**
	 * @param string $message
	 * @param string|array<string>|null $parameters
	 *
	 * @return string
	 */
    public function build(string $message, string|array|null $parameters = null): string
    {
        $translatedMessage = $this->translator->trans($message, domain: 'validators');
        if (!$parameters) {
            return $translatedMessage;
        }

        $sanitizedMessage = preg_replace('/\{{2}\s[\d\w]+\s}{2}/m', '%s', $translatedMessage);
		if ($sanitizedMessage === null) {
			return '';
		}

        if (is_array($parameters)) {
            return vsprintf($sanitizedMessage, $parameters);
        }

        return sprintf($sanitizedMessage, $parameters);
    }
}