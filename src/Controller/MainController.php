<?php

namespace App\Controller;

use App\Entity\Report;
use App\Entity\Severity;
use App\Facade\MainFacade;
use App\Form\ReportFormFactory;
use App\Mapbox\MapFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 *
 */
class MainController extends AbstractController
{
	/** @var MainFacade */
	private MainFacade $mainFacade;

	/** @var MapFactory */
	private MapFactory $mapFactory;

	/** @var ReportFormFactory */
	private ReportFormFactory $reportFormFactory;

	/** @var TranslatorInterface */
	private TranslatorInterface $translator;

	/**
	 *
	 */
	public function __construct(
		MainFacade $mainFacade,
		MapFactory $mapFactory,
		ReportFormFactory $reportFormFactory,
		TranslatorInterface $translator)
	{
		$this->mainFacade = $mainFacade;
		$this->mapFactory = $mapFactory;
		$this->reportFormFactory = $reportFormFactory;
		$this->translator = $translator;
	}

	/**
	 * @Route("/", name="main")
	 */
	public function index(Request $request, EntityManagerInterface $entityManager): Response
	{
		$map = $this->mapFactory->create();

		$report = new Report();
		$reportForm = $this->reportFormFactory->create($this->createFormBuilder($report))
			->handleRequest($request);

		$severities = $entityManager->getRepository(Severity::class)->findAll();

		$shouldFirstFormBeVisible = $this->mainFacade->shouldFirstFormBeVisible($reportForm);
		$shouldSecondFormBeVisible = !$shouldFirstFormBeVisible && $this->mainFacade->shouldSecondFormBeVisible($reportForm);

		if ($this->mainFacade->isUserRobot($reportForm)) {
			$this->addFlash('danger', $this->translator->trans('flash.you_are_robot'));
		}

		if ($reportForm->isSubmitted()) {
			if ($reportForm->isValid()) {
				$report = $reportForm->getData();
				$entityManager->persist($report);
				$entityManager->flush();

				$this->addFlash('success', $this->translator->trans('flash.report_added'));

				return $this->redirectToRoute('main');
			} else {
				$this->addFlash('danger', $this->translator->trans('flash.report_failed'));
			}
		}

		return $this->render('base.html.twig', [
			'map'						=> $map,
			'severities'				=> $severities,
			'reportForm'				=> $reportForm->createView(),
			'shouldFirstFormBeVisible'	=> $shouldFirstFormBeVisible,
			'shouldSecondFormBeVisible'	=> $shouldSecondFormBeVisible
		]);
	}
}