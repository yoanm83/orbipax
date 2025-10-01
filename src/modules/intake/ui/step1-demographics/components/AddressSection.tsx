'use client'

import { Home, ChevronUp, ChevronDown } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Checkbox } from "@/shared/ui/primitives/Checkbox"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/primitives/Select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/ui/primitives/Form"
import type { Demographics } from "@/modules/intake/domain/schemas/demographics/demographics.schema"

type HousingStatus = 'homeless' | 'supported' | 'independent' | 'family' | 'group' | 'other'

interface AddressSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
  form: UseFormReturn<Partial<Demographics>>
}

export function AddressSection({ onSectionToggle, isExpanded, form }: AddressSectionProps) {
  // Watch for mailing address toggle
  const sameAsMailingAddress = form.watch('sameAsMailingAddress')

  return (
    <Card variant="elevated" className="w-full rounded-2xl @container">
      <div
        id="header-address"
        className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px] hover:bg-[var(--accent)]/8 active:bg-[var(--accent)]/12 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset-background)]"
        onClick={onSectionToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSectionToggle()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls="panel-address"
      >
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">Address Information</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        )}
      </div>

      {isExpanded && (
        <CardBody id="panel-address" aria-labelledby="header-address" className="p-6">
          <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
            {/* Home Address */}
            <FormField
              control={form.control}
              name="address.street1"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Home Address *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your home address"
                      className="min-h-11"
                      aria-invalid={!!form.formState.errors.address?.street1}
                      aria-describedby={form.formState.errors.address?.street1 ? "address-street1-error" : undefined}
                    />
                  </FormControl>
                  <FormMessage id="address-street1-error" role="alert" />
                </FormItem>
              )}
            />

            {/* Address Line 2 */}
            <FormField
              control={form.control}
              name="address.street2"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Apartment, suite, unit, etc."
                      className="min-h-11"
                      aria-invalid={!!form.formState.errors.address?.street2}
                      aria-describedby={form.formState.errors.address?.street2 ? "address-street2-error" : undefined}
                    />
                  </FormControl>
                  <FormMessage id="address-street2-error" role="alert" />
                </FormItem>
              )}
            />

            {/* City */}
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>City *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="City"
                      className="min-h-11"
                      aria-invalid={!!form.formState.errors.address?.city}
                      aria-describedby={form.formState.errors.address?.city ? "address-city-error" : undefined}
                    />
                  </FormControl>
                  <FormMessage id="address-city-error" role="alert" />
                </FormItem>
              )}
            />

            {/* State */}
            <FormField
              control={form.control}
              name="address.state"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>State *</FormLabel>
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="min-h-11"
                        aria-invalid={!!form.formState.errors.address?.state}
                        aria-describedby={form.formState.errors.address?.state ? "address-state-error" : undefined}
                      >
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="AK">Alaska</SelectItem>
                      <SelectItem value="AZ">Arizona</SelectItem>
                      <SelectItem value="AR">Arkansas</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="CO">Colorado</SelectItem>
                      <SelectItem value="CT">Connecticut</SelectItem>
                      <SelectItem value="DE">Delaware</SelectItem>
                      <SelectItem value="DC">District of Columbia</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="GA">Georgia</SelectItem>
                      <SelectItem value="HI">Hawaii</SelectItem>
                      <SelectItem value="ID">Idaho</SelectItem>
                      <SelectItem value="IL">Illinois</SelectItem>
                      <SelectItem value="IN">Indiana</SelectItem>
                      <SelectItem value="IA">Iowa</SelectItem>
                      <SelectItem value="KS">Kansas</SelectItem>
                      <SelectItem value="KY">Kentucky</SelectItem>
                      <SelectItem value="LA">Louisiana</SelectItem>
                      <SelectItem value="ME">Maine</SelectItem>
                      <SelectItem value="MD">Maryland</SelectItem>
                      <SelectItem value="MA">Massachusetts</SelectItem>
                      <SelectItem value="MI">Michigan</SelectItem>
                      <SelectItem value="MN">Minnesota</SelectItem>
                      <SelectItem value="MS">Mississippi</SelectItem>
                      <SelectItem value="MO">Missouri</SelectItem>
                      <SelectItem value="MT">Montana</SelectItem>
                      <SelectItem value="NE">Nebraska</SelectItem>
                      <SelectItem value="NV">Nevada</SelectItem>
                      <SelectItem value="NH">New Hampshire</SelectItem>
                      <SelectItem value="NJ">New Jersey</SelectItem>
                      <SelectItem value="NM">New Mexico</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="NC">North Carolina</SelectItem>
                      <SelectItem value="ND">North Dakota</SelectItem>
                      <SelectItem value="OH">Ohio</SelectItem>
                      <SelectItem value="OK">Oklahoma</SelectItem>
                      <SelectItem value="OR">Oregon</SelectItem>
                      <SelectItem value="PA">Pennsylvania</SelectItem>
                      <SelectItem value="RI">Rhode Island</SelectItem>
                      <SelectItem value="SC">South Carolina</SelectItem>
                      <SelectItem value="SD">South Dakota</SelectItem>
                      <SelectItem value="TN">Tennessee</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="UT">Utah</SelectItem>
                      <SelectItem value="VT">Vermont</SelectItem>
                      <SelectItem value="VA">Virginia</SelectItem>
                      <SelectItem value="WA">Washington</SelectItem>
                      <SelectItem value="WV">West Virginia</SelectItem>
                      <SelectItem value="WI">Wisconsin</SelectItem>
                      <SelectItem value="WY">Wyoming</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage id="address-state-error" role="alert" />
                </FormItem>
              )}
            />

            {/* Zip Code */}
            <FormField
              control={form.control}
              name="address.zipCode"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Zip Code *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Zip Code"
                      className="min-h-11"
                      aria-invalid={!!form.formState.errors.address?.zipCode}
                      aria-describedby={form.formState.errors.address?.zipCode ? "address-zipcode-error" : undefined}
                    />
                  </FormControl>
                  <FormMessage id="address-zipcode-error" role="alert" />
                </FormItem>
              )}
            />

            {/* Country */}
            <FormField
              control={form.control}
              name="address.country"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value="United States"
                      readOnly
                      disabled
                      aria-readonly="true"
                      className="bg-muted min-h-11"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Different Mailing Address Toggle */}
            <FormField
              control={form.control}
              name="sameAsMailingAddress"
              render={({ field }) => (
                <FormItem className="space-y-2 @lg:col-span-2">
                  <div className="flex items-center gap-2 min-h-[44px] py-2">
                    <FormControl>
                      <Checkbox
                        id="sameAsMailing"
                        checked={!field.value}
                        onCheckedChange={(checked) => field.onChange(!checked)}
                        className="h-5 w-5"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="sameAsMailing"
                      className="cursor-pointer select-none font-normal"
                    >
                      Mailing address is different from home address
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

          </div>

          {/* Mailing Address Fields (conditional) */}
          {!sameAsMailingAddress && (
            <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6 mt-6">
              {/* Mailing Address */}
              <FormField
                control={form.control}
                name="mailingAddress.street1"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Mailing Address *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="Enter mailing address"
                        className="min-h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mailing Address Line 2 */}
              <FormField
                control={form.control}
                name="mailingAddress.street2"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Address Line 2</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="Apartment, suite, unit, etc."
                        className="min-h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mailing City */}
              <FormField
                control={form.control}
                name="mailingAddress.city"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="City"
                        className="min-h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mailing State */}
              <FormField
                control={form.control}
                name="mailingAddress.state"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>State *</FormLabel>
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="min-h-11">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="AK">Alaska</SelectItem>
                        <SelectItem value="AZ">Arizona</SelectItem>
                        <SelectItem value="AR">Arkansas</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="CO">Colorado</SelectItem>
                        <SelectItem value="CT">Connecticut</SelectItem>
                        <SelectItem value="DE">Delaware</SelectItem>
                        <SelectItem value="DC">District of Columbia</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="GA">Georgia</SelectItem>
                        <SelectItem value="HI">Hawaii</SelectItem>
                        <SelectItem value="ID">Idaho</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                        <SelectItem value="IN">Indiana</SelectItem>
                        <SelectItem value="IA">Iowa</SelectItem>
                        <SelectItem value="KS">Kansas</SelectItem>
                        <SelectItem value="KY">Kentucky</SelectItem>
                        <SelectItem value="LA">Louisiana</SelectItem>
                        <SelectItem value="ME">Maine</SelectItem>
                        <SelectItem value="MD">Maryland</SelectItem>
                        <SelectItem value="MA">Massachusetts</SelectItem>
                        <SelectItem value="MI">Michigan</SelectItem>
                        <SelectItem value="MN">Minnesota</SelectItem>
                        <SelectItem value="MS">Mississippi</SelectItem>
                        <SelectItem value="MO">Missouri</SelectItem>
                        <SelectItem value="MT">Montana</SelectItem>
                        <SelectItem value="NE">Nebraska</SelectItem>
                        <SelectItem value="NV">Nevada</SelectItem>
                        <SelectItem value="NH">New Hampshire</SelectItem>
                        <SelectItem value="NJ">New Jersey</SelectItem>
                        <SelectItem value="NM">New Mexico</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="NC">North Carolina</SelectItem>
                        <SelectItem value="ND">North Dakota</SelectItem>
                        <SelectItem value="OH">Ohio</SelectItem>
                        <SelectItem value="OK">Oklahoma</SelectItem>
                        <SelectItem value="OR">Oregon</SelectItem>
                        <SelectItem value="PA">Pennsylvania</SelectItem>
                        <SelectItem value="RI">Rhode Island</SelectItem>
                        <SelectItem value="SC">South Carolina</SelectItem>
                        <SelectItem value="SD">South Dakota</SelectItem>
                        <SelectItem value="TN">Tennessee</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="UT">Utah</SelectItem>
                        <SelectItem value="VT">Vermont</SelectItem>
                        <SelectItem value="VA">Virginia</SelectItem>
                        <SelectItem value="WA">Washington</SelectItem>
                        <SelectItem value="WV">West Virginia</SelectItem>
                        <SelectItem value="WI">Wisconsin</SelectItem>
                        <SelectItem value="WY">Wyoming</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage id="mailing-state-error" role="alert" />
              </FormItem>
                )}
              />

              {/* Mailing Zip Code */}
              <FormField
                control={form.control}
                name="mailingAddress.zipCode"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Zip Code *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ''}
                        placeholder="Zip Code"
                        className="min-h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mailing Country */}
              <FormField
                control={form.control}
                name="mailingAddress.country"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value="United States"
                        readOnly
                        disabled
                        aria-readonly="true"
                        className="bg-muted min-h-11"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Housing Status - TODO: Not in schema, needs to be added or removed */}
          <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6 mt-6">
            <FormField
              control={form.control}
              name="housingStatus"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Housing Status *</FormLabel>
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger
                        className="min-h-11"
                        aria-invalid={!!form.formState.errors.housingStatus}
                        aria-describedby={form.formState.errors.housingStatus ? "housing-status-error" : undefined}
                      >
                        <SelectValue placeholder="Select housing status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="homeless">Homeless</SelectItem>
                      <SelectItem value="supported">Supported Housing</SelectItem>
                      <SelectItem value="independent">Independent</SelectItem>
                      <SelectItem value="family">With Family</SelectItem>
                      <SelectItem value="group">Group Home</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage id="housing-status-error" role="alert" />
                </FormItem>
              )}
            />
          </div>
        </CardBody>
      )}
    </Card>
  )
} 