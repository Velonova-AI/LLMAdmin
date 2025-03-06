import SurveyForm from "./form-component"

export default function ResearchPage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Business Research Survey</h1>
          <p className="text-gray-600">
            By filling this survey help us build better products.
          </p>
        </div>

        <SurveyForm />


      </div>
    </div>
  )
}

