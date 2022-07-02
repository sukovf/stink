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

/**
 *
 */
class MainController extends AbstractController
{
	/**
	 * @Route("/", name="main")
	 */
	public function index(Request $request, MainFacade $mainFacade, MapFactory $mapFactory, ReportFormFactory $reportFormFactory, EntityManagerInterface $entityManager): Response
	{
		$map = $mapFactory->create();

		$report = new Report();
		$reportForm = $reportFormFactory->create($this->createFormBuilder($report))
			->handleRequest($request);

		$severities = $entityManager->getRepository(Severity::class)->findAll();

		$shouldFirstFormBeVisible = $mainFacade->shouldFirstFormBeVisible($reportForm);
		$shouldSecondFormBeVisible = !$shouldFirstFormBeVisible && $mainFacade->shouldSecondFormBeVisible($reportForm);

		if ($reportForm->isSubmitted()) {
			if ($reportForm->isValid()) {
				$report = $reportForm->getData();
				$entityManager->persist($report);
				$entityManager->flush();

				$this->addFlash('success', 'Report successfully added!');
			} else {
				$this->addFlash('danger', 'Something went wrong...');
			}

			return $this->redirectToRoute('main');
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