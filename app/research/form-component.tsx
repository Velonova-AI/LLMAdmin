"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type FormData, formSchema, type SubmissionStatus } from "./schema"
import { submitForm } from "./actions"

// UI Components
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

// Helper components with proper type annotations
interface ChildrenProps {
  children: React.ReactNode
}

const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
)

const RequiredLabel = ({ children }: ChildrenProps) => (
    <>
      {children} <span className="text-red-500">*</span>
    </>
)

const AlertSuccess = ({ children }: ChildrenProps) => (
    <Alert className="bg-green-50 border-green-200">
      <CheckCircle2 className="size-4 text-green-600" />
      <AlertDescription className="text-green-800">{children}</AlertDescription>
    </Alert>
)

const AlertError = ({ children }: ChildrenProps) => (
    <Alert className="bg-red-50 border-red-200">
      <AlertCircle className="size-4 text-red-600" />
      <AlertDescription className="text-red-800">{children}</AlertDescription>
    </Alert>
)

function SurveyForm() {
  const [status, setStatus] = useState<SubmissionStatus>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      generalInfo: {
        name: "",
        email: "",
        country: "",
        startupName: "",

      },
      contentGenerationChallenges: {
        challenges: [],
      },
      generativeAI: {
        used: true,
        solutions: [],
        currentSolutionName: "",
      },
      satisfactionGaps: {
        unsatisfactorySolutions: [],
      },
      featureExpectations: "",
      willingnessToPay: {
        likelihood: 5,
        priceRange: "",
      },
      additionalInsights: "",
      contactInfo: {
        followUpInterview: false,
      },
    },
  })

  // EU countries first, then other countries alphabetically
  const euCountries = [
    "Netherlands",
    "Switzerland",
    "Austria",
    "Belgium",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Liechtenstein",
    "Malta",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
  ]

  const otherCountries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Côte d'Ivoire",
    "Cuba",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Gabon",
    "Gambia",
    "Georgia",
    "Ghana",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Israel",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",

    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "North Macedonia",

    "Oman",
    "Pakistan",
    "Palau",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Qatar",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Korea",
    "South Sudan",
    "Sri Lanka",
    "Sudan",
    "Suriname",

    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ]

  const contentGenerationChallengeOptions = [
    { id: "funding", label: "Funding (e.g., grant writing, business plan, pitch deck, investor outreach)" },
    { id: "legaltech", label: "Legaltech (e.g., policy generation, GDPR compliance, EU AI Act compliance)" },
    { id: "it", label: "IT (e.g., website development, mobile app development, landing page creation)" },
    { id: "product-marketing", label: "Product Marketing (e.g., product descriptions, promotional content)" },
    { id: "content-marketing", label: "Content Marketing (e.g., blog posts, email campaigns, SEO, social media)" },
    { id: "other", label: "Other" },
  ]

  const generativeAISolutionOptions = [
    { id: "grant-writing", label: "Grant Writing" },
    { id: "business-plan", label: "Business Plan Generation" },
    { id: "terms-conditions", label: "Terms and Conditions Generator" },
    { id: "privacy-policy", label: "Privacy Policy Generator" },
    { id: "product-marketing", label: "Product Marketing" },
    { id: "content-marketing", label: "Content Marketing" },
    { id: "blog-post", label: "Blog Post Generation" },
    { id: "social-media", label: "Social Media Content Creation" },
    { id: "seo-content", label: "SEO Content Generation" },
    { id: "email-marketing", label: "Email Marketing Campaigns" },
    { id: "press-release", label: "Press Release Writing" },
    { id: "product-descriptions", label: "Product Descriptions" },
    { id: "video-script", label: "Video Script Writing" },
    { id: "customer-support", label: "Customer Support Responses" },
    { id: "sales-outreach", label: "Sales Outreach Emails" },
    { id: "business-proposals", label: "Business Proposals" },
    { id: "other", label: "Other" },
  ]

  const priceRangeOptions = [
    { id: "0-50", label: "€0 - €50/month" },
    { id: "51-100", label: "€51 - €100/month" },
    { id: "101-200", label: "€101 - €200/month" },
    { id: "201-500", label: "€201 - €500/month" },
    { id: "501-1000", label: "€501 - €1000/month" },
    { id: "other", label: "Other" },
  ]

  const showOtherChallenge = form.watch("contentGenerationChallenges.challenges")?.includes("other")
  const hasUsedAI = form.watch("generativeAI.used")
  const showOtherSolution = form.watch("generativeAI.solutions")?.includes("other")
  const showOtherUnsatisfactorySolution = form.watch("satisfactionGaps.unsatisfactorySolutions")?.includes("other")
  const showOtherPriceRange = form.watch("willingnessToPay.priceRange") === "other"

  async function onSubmit(data: FormData) {
    setIsSubmitting(true)
    try {
      const result = await submitForm(data)
      if (result.success) {
        setStatus({ type: "success", message: result.message })
        form.reset()
      } else {
        setStatus({ type: "error", message: result.message })
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
      <>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormSection title="1. General Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="generalInfo.name"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>1.1 Name</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="generalInfo.email"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>1.2 Email</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Your email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="generalInfo.country"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>1.3 Country</RequiredLabel>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {euCountries.length > 0 && (
                                  <>
                                    <div className="px-2 py-1.5 text-sm font-semibold">European Union</div>
                                    {euCountries.map((country) => (
                                        <SelectItem key={country} value={country}>
                                          {country}
                                        </SelectItem>
                                    ))}
                                    <div className="px-2 py-1.5 text-sm font-semibold">Other Countries</div>
                                  </>
                              )}
                              {otherCountries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="generalInfo.startupName"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <RequiredLabel>1.4 Startup Name</RequiredLabel>
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Your startup's name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />


              </div>
            </FormSection>

            <FormSection title="2. Content Generation Challenges">
              <FormField
                  control={form.control}
                  name="contentGenerationChallenges.challenges"
                  render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>
                            <RequiredLabel>
                              2.1 Based on your experience as a startup founder, what are the top three content generation and
                              compliance challenges your startup currently faces?
                            </RequiredLabel>
                          </FormLabel>
                          <FormDescription>Select all that apply</FormDescription>
                        </div>
                        {contentGenerationChallengeOptions.map((option) => (
                            <FormField
                                key={option.id}
                                control={form.control}
                                name="contentGenerationChallenges.challenges"
                                render={({ field }) => {
                                  return (
                                      <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                                        <FormControl>
                                          <Checkbox
                                              checked={field.value?.includes(option.id)}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                    ? field.onChange([...field.value, option.id])
                                                    : field.onChange(field.value?.filter((value) => value !== option.id))
                                              }}
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">{option.label}</FormLabel>
                                      </FormItem>
                                  )
                                }}
                            />
                        ))}
                        <FormMessage />
                      </FormItem>
                  )}
              />
              {showOtherChallenge && (
                  <FormField
                      control={form.control}
                      name="contentGenerationChallenges.otherChallenge"
                      render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Please specify other challenge</FormLabel>
                            <FormControl>
                              <Input placeholder="Other content generation challenge" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
              )}
            </FormSection>

            <FormSection title="3. Generative AI Solutions">
              <FormField
                  control={form.control}
                  name="generativeAI.used"
                  render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>
                          <RequiredLabel>3.1 Have you used any generative AI solutions in your startup?</RequiredLabel>
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                              onValueChange={(value) => field.onChange(value === "true")}
                              defaultValue={field.value ? "true" : "false"}
                              className="flex flex-row space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="true" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="false" />
                              </FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              {hasUsedAI && (
                  <>
                    <FormField
                        control={form.control}
                        name="generativeAI.currentSolutionName"
                        render={({ field }) => (
                            <FormItem className="mt-6">
                              <FormLabel>
                                <RequiredLabel>3.2 Name/website of the solution you currently use</RequiredLabel>
                              </FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., ChatGPT, Jasper.ai, Copy.ai" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="generativeAI.solutions"
                        render={() => (
                            <FormItem className="mt-6">
                              <div className="mb-4">
                                <FormLabel>
                                  <RequiredLabel>3.3 Which of the following have you used?</RequiredLabel>
                                </FormLabel>
                                <FormDescription>Select all that apply</FormDescription>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {generativeAISolutionOptions.map((option) => (
                                    <FormField
                                        key={option.id}
                                        control={form.control}
                                        name="generativeAI.solutions"
                                        render={({ field }) => {
                                          return (
                                              <FormItem
                                                  key={option.id}
                                                  className="flex flex-row items-start space-x-3 space-y-0 mb-2"
                                              >
                                                <FormControl>
                                                  <Checkbox
                                                      checked={field.value?.includes(option.id)}
                                                      onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), option.id])
                                                            : field.onChange(field.value?.filter((value) => value !== option.id))
                                                      }}
                                                  />
                                                </FormControl>
                                                <FormLabel className="font-normal">{option.label}</FormLabel>
                                              </FormItem>
                                          )
                                        }}
                                    />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                        )}
                    />
                  </>
              )}

              {hasUsedAI && showOtherSolution && (
                  <FormField
                      control={form.control}
                      name="generativeAI.otherSolution"
                      render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Please specify other solution</FormLabel>
                            <FormControl>
                              <Input placeholder="Other generative AI solution" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
              )}
            </FormSection>

            {hasUsedAI && (
                <FormSection title="4. Satisfaction and Gaps">
                  <FormField
                      control={form.control}
                      name="satisfactionGaps.unsatisfactorySolutions"
                      render={() => (
                          <FormItem>
                            <div className="mb-4">
                              <FormLabel>
                                <RequiredLabel>4.1 Which generative AI solution has not met your requirements?</RequiredLabel>
                              </FormLabel>
                              <FormDescription>Select all that apply</FormDescription>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {generativeAISolutionOptions.map((option) => (
                                  <FormField
                                      key={option.id}
                                      control={form.control}
                                      name="satisfactionGaps.unsatisfactorySolutions"
                                      render={({ field }) => {
                                        return (
                                            <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0 mb-2">
                                              <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(option.id)}
                                                    onCheckedChange={(checked) => {
                                                      return checked
                                                          ? field.onChange([...(field.value || []), option.id])
                                                          : field.onChange(field.value?.filter((value) => value !== option.id))
                                                    }}
                                                />
                                              </FormControl>
                                              <FormLabel className="font-normal">{option.label}</FormLabel>
                                            </FormItem>
                                        )
                                      }}
                                  />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                      )}
                  />

                  {showOtherUnsatisfactorySolution && (
                      <FormField
                          control={form.control}
                          name="satisfactionGaps.otherUnsatisfactorySolution"
                          render={({ field }) => (
                              <FormItem className="mt-4">
                                <FormLabel>Please specify other unsatisfactory solution</FormLabel>
                                <FormControl>
                                  <Input placeholder="Other unsatisfactory solution" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                          )}
                      />
                  )}
                </FormSection>
            )}

            <FormSection title="5. Feature Expectations">
              <FormField
                  control={form.control}
                  name="featureExpectations"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <RequiredLabel>
                            5.1 What specific features or improvements would you expect from a generative AI solution to
                            better meet your startup&#39;s needs?
                          </RequiredLabel>
                        </FormLabel>
                        <FormControl>
                          <Textarea
                              placeholder="Data Security, Privacy, Collaboration"
                              className="min-h-[120px]"
                              {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />
            </FormSection>

            <FormSection title="6. Willingness to Pay">
              <FormField
                  control={form.control}
                  name="willingnessToPay.likelihood"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <RequiredLabel>
                            6.1 On a scale of 1 to 10, how likely are you to pay for a generative AI solution that addresses
                            your productivity challenges?
                          </RequiredLabel>
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Slider
                                min={1}
                                max={10}
                                step={1}
                                defaultValue={[field.value]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                            />
                            <div className="flex justify-between">
                              <span className="text-sm">1 - Not Likely</span>
                              <span className="text-sm font-medium">{field.value}</span>
                              <span className="text-sm">10 - Very Likely</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="willingnessToPay.priceRange"
                  render={({ field }) => (
                      <FormItem className="mt-6">
                        <FormLabel>
                          <RequiredLabel>
                            6.2 What price range would you consider reasonable for such a solution?
                          </RequiredLabel>
                        </FormLabel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {priceRangeOptions.map((option) => (
                              <FormItem key={option.id} className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <div className="flex items-center space-x-3">
                                    <Checkbox
                                        checked={field.value === option.id}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            field.onChange(option.id)
                                          } else {
                                            field.onChange("")
                                          }
                                        }}
                                        id={option.id}
                                    />
                                    <Label htmlFor={option.id} className="font-normal">
                                      {option.label}
                                    </Label>
                                  </div>
                                </FormControl>
                              </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                  )}
              />

              {showOtherPriceRange && (
                  <FormField
                      control={form.control}
                      name="willingnessToPay.otherPriceRange"
                      render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Please specify other price range</FormLabel>
                            <FormControl>
                              <Input placeholder="Other price range" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                      )}
                  />
              )}
            </FormSection>

            <FormSection title="7. Additional Insights">
              <FormField
                  control={form.control}
                  name="additionalInsights"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          7.1 Are there any other challenges or needs your startup faces that you believe could be addressed
                          by generative AI solutions?
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Share any additional insights" className="min-h-[120px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                  )}
              />
            </FormSection>

            <FormSection title="8. Contact Information">
              <FormField
                  control={form.control}
                  name="contactInfo.followUpInterview"
                  render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            8.1 Would you be interested in participating in a follow-up interview to discuss your responses in
                            more detail?
                          </FormLabel>
                        </div>
                      </FormItem>
                  )}
              />
            </FormSection>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Survey"}
            </Button>
          </form>
        </Form>

        {status && (
            <div className="mb-6">
              {status.type === "success" ? (
                  <AlertSuccess>{status.message}</AlertSuccess>
              ) : (
                  <AlertError>{status.message}</AlertError>
              )}
            </div>
        )}

      </>
  )
}

// Export the component
export default SurveyForm

