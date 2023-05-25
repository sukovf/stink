<?php

namespace App\Controller;

use App\Entity\Report;
use App\Facade\MainFacade;
use App\Facade\ReportFacade;
use App\Facade\SeverityFacade;
use App\Form\ReportFormFactory;
use App\Mapbox\MapFactory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\Translation\TranslatorInterface;

class MainController extends AbstractController
{
	/**
	 * @Route("/", name="main")
	 */
	public function index(
		Request $request,
		MainFacade $mainFacade,
		SeverityFacade $severityFacade,
		ReportFacade $reportFacade,
		MapFactory $mapFactory,
		ReportFormFactory $reportFormFactory,
		TranslatorInterface $translator
	): Response
	{
		$report = new Report();
		$reportForm = $reportFormFactory->create($this->createFormBuilder($report))
			->handleRequest($request);

		/**
		 * If the validation of the detail section (reporters' credentials, etc.) of the report form fails, show
		 * the detail card right away and let the user know they need to fix the errors.
		 */
		$showDetailCard = $mainFacade->shouldDetailCardBeVisible($reportForm);

		/**
		 * If the validation of the location section of the report form fails, show
		 * the location card right away and let the user know they need to fix the errors.
		 */
		$showLocationCard = !$showDetailCard && $mainFacade->shouldLocationCardBeVisible($reportForm);

		if ($mainFacade->isUserRobot($reportForm)) {
			$this->addFlash('danger', $translator->trans('flash.you_are_robot'));
		}

		if ($reportForm->isSubmitted()) {
			if ($reportForm->isValid()) {
				/** @var Report $report */
				$report = $reportForm->getData();

				$reportFacade->save($report);

				$this->addFlash('success', $translator->trans('flash.report_added'));

				return $this->redirectToRoute('main');
			} else {
				$this->addFlash('danger', $translator->trans('flash.report_failed'));
			}
		}

		return $this->render('base.html.twig', [
			'map'				=> $mapFactory->create(),
			'severities'		=> $severityFacade->getAll(),
			'reportForm'		=> $reportForm->createView(),
			'showDetailCard'	=> $showDetailCard,
			'showLocationCard'	=> $showLocationCard
		]);
	}
}