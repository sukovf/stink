<?php

namespace App\LiveFormValidation\Rule\Generator;

use App\LiveFormValidation\Exception\PropertyNotFoundException;
use Doctrine\Common\Annotations\AnnotationReader;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\Persistence\ObjectManager;
use ReflectionException;
use Symfony\Component\Validator\Constraint;

/**
 *
 */
class MetadataProvider
{
    /** @var ObjectManager */
    private ObjectManager $entityManager;

    /**
     *
     */
    public function __construct(ManagerRegistry $doctrine)
    {
        $this->entityManager = $doctrine->getManager();
    }

    /**
     * @param class-string $class
     * @param string $propertyName
     *
     * @return Constraint[]
     */
    public function getEntityPropertyConstraints(string $class, string $propertyName): array
    {
        $metadata = $this->entityManager->getClassMetadata($class);
        try {
            $annotations = (new AnnotationReader())
                ->getPropertyAnnotations($metadata->getReflectionClass()->getProperty($propertyName));
        } catch (ReflectionException $e) {
            throw new PropertyNotFoundException($e);
        }

        $constraints = [];
        foreach ($annotations as $annotation) {
            if ($annotation instanceof Constraint) {
                $constraints[] = $annotation;
            }
        }

        return $constraints;
    }
}