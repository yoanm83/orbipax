'use client'

import { useState } from "react"
// TODO: Replace with server-driven form state
import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/primitives/Select"
import { Checkbox } from "@/shared/ui/primitives/Checkbox"
import { Home, ChevronUp, ChevronDown } from "lucide-react"

type HousingStatus = 'homeless' | 'supported' | 'independent' | 'family' | 'group' | 'other'

interface AddressSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

export function AddressSection({ onSectionToggle, isExpanded }: AddressSectionProps) {
  // TODO: Replace with server-driven form state
  const [addressInfo, setAddressInfo] = useState({
    homeAddress: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    housingStatus: '' as HousingStatus,
    housingStatusOther: '',
    isTemporary: false,
    tempEndDate: null,
    differentMailingAddress: false,
    mailingAddress: '',
    mailingCity: '',
    mailingState: '',
    mailingZipCode: ''
  })

  const handleAddressInfoChange = (data: any) => {
    // TODO: Replace with server-driven form handling
    setAddressInfo(prev => ({ ...prev, ...data }))
    console.log('Address change:', data)
  }

  return (
    <Card className="w-full rounded-2xl shadow-md mb-6 @container">
      <div
        className="p-6 flex justify-between items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-h-16"
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
        aria-controls="address-content"
      >
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-xl font-semibold">Address Information</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5" aria-hidden="true" />
        ) : (
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        )}
      </div>

      {isExpanded && (
        <CardBody id="address-content" className="p-6">
          <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
            {/* Home Address */}
            <div className="space-y-2">
              <Label htmlFor="homeAddress">Home Address *</Label>
              <Input
                id="homeAddress"
                placeholder="Enter your home address"
                required
                value={addressInfo.homeAddress}
                onChange={(e) => handleAddressInfoChange({ homeAddress: e.target.value })}
                className="min-h-11"
              />
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                placeholder="Apartment, suite, unit, etc."
                value={addressInfo.addressLine2 || ''}
                onChange={(e) => handleAddressInfoChange({ addressLine2: e.target.value })}
                className="min-h-11"
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="City"
                required
                value={addressInfo.city}
                onChange={(e) => handleAddressInfoChange({ city: e.target.value })}
                className="min-h-11"
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select
                value={addressInfo.state}
                onValueChange={(value) => handleAddressInfoChange({ state: value })}
              >
                <SelectTrigger id="state" className="min-h-11">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
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
            </div>

            {/* Zip Code */}
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code *</Label>
              <Input
                id="zipCode"
                placeholder="Zip Code"
                required
                value={addressInfo.zipCode}
                onChange={(e) => handleAddressInfoChange({ zipCode: e.target.value })}
                className="min-h-11"
              />
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value="United States"
                readOnly
                disabled
                aria-readonly="true"
                className="bg-muted min-h-11"
              />
            </div>

            {/* Different Mailing Address Toggle */}
            <div className="space-y-2 @lg:col-span-2">
              <Checkbox
                id="differentMailing"
                checked={addressInfo.differentMailingAddress}
                onCheckedChange={(checked) => handleAddressInfoChange({ differentMailingAddress: checked === true })}
                label="Mailing address is different from home address"
                className="min-h-[44px]"
              />
            </div>

            {/* Mailing Address Fields (conditional) */}
            {addressInfo.differentMailingAddress && (
              <>
                {/* Mailing Address */}
                <div className="space-y-2">
                  <Label htmlFor="mailingAddress">Mailing Address *</Label>
                  <Input
                    id="mailingAddress"
                    placeholder="Enter mailing address"
                    required
                    value={addressInfo.mailingAddress || ''}
                    onChange={(e) => handleAddressInfoChange({ mailingAddress: e.target.value })}
                    className="min-h-11"
                  />
                </div>

                {/* Mailing City */}
                <div className="space-y-2">
                  <Label htmlFor="mailingCity">City *</Label>
                  <Input
                    id="mailingCity"
                    placeholder="City"
                    required
                    value={addressInfo.mailingCity || ''}
                    onChange={(e) => handleAddressInfoChange({ mailingCity: e.target.value })}
                    className="min-h-11"
                  />
                </div>

                {/* Mailing State */}
                <div className="space-y-2">
                  <Label htmlFor="mailingState">State *</Label>
                  <Select
                    value={addressInfo.mailingState || ''}
                    onValueChange={(value) => handleAddressInfoChange({ mailingState: value })}
                  >
                    <SelectTrigger id="mailingState" className="min-h-11">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
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
                </div>

                {/* Mailing Zip Code */}
                <div className="space-y-2">
                  <Label htmlFor="mailingZipCode">Zip Code *</Label>
                  <Input
                    id="mailingZipCode"
                    placeholder="Zip Code"
                    required
                    value={addressInfo.mailingZipCode || ''}
                    onChange={(e) => handleAddressInfoChange({ mailingZipCode: e.target.value })}
                    className="min-h-11"
                  />
                </div>

                {/* Mailing Country */}
                <div className="space-y-2">
                  <Label htmlFor="mailingCountry">Country</Label>
                  <Input
                    id="mailingCountry"
                    value="United States"
                    readOnly
                    disabled
                    aria-readonly="true"
                    className="bg-muted min-h-11"
                  />
                </div>
              </>
            )}

            {/* Housing Status */}
            <div className="space-y-2">
              <Label htmlFor="housingStatus">Housing Status *</Label>
              <Select
                value={addressInfo.housingStatus}
                onValueChange={(value: HousingStatus) => handleAddressInfoChange({ housingStatus: value })}
              >
                <SelectTrigger id="housingStatus" className="min-h-11">
                  <SelectValue placeholder="Select housing status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homeless">Homeless</SelectItem>
                  <SelectItem value="supported">Supported Housing</SelectItem>
                  <SelectItem value="independent">Independent</SelectItem>
                  <SelectItem value="family">With Family</SelectItem>
                  <SelectItem value="group">Group Home</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
} 