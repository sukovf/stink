<?php

namespace App\LiveFormValidation\Rule;

use JsonSerializable;

/**
 *
 */
class Rule implements JsonSerializable
{
    /** @var RuleOperations */
    private RuleOperations $operation;

    /** @var mixed */
    private mixed $args;

    /** @var string */
    private string $message;

    /**
     *
     */
    public function __construct(RuleOperations $operation = RuleOperations::NONE, mixed $args = null, string $message = '')
    {
        $this->operation = $operation;
        $this->args = $args;
        $this->message = $message;
    }

    /**
     *
     */
    public function setOperation(RuleOperations $operation): void
    {
        $this->operation = $operation;
    }

    /**
     *
     */
    public function getOperation(): RuleOperations
    {
        return $this->operation;
    }

    /**
     *
     */
    public function setArgs(mixed $args): void
    {
        $this->args = $args;
    }

    /**
     *
     */
    public function getArgs(): mixed
    {
        return $this->args;
    }

    /**
     *
     */
    public function setMessage(string $message): void
    {
        $this->message = $message;
    }

    /**
     *
     */
    public function getMessage(): string
    {
        return $this->message;
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return [
            'op'    => $this->operation,
            'args'  => $this->args,
            'msg'   => $this->message
        ];
    }
}