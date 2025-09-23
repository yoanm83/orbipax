'use client'

// TODO: Replace with server-driven form state
import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"
import { Select } from "@/shared/ui/primitives/Select"
import { Checkbox } from "@/shared/ui/primitives/Checkbox"
import { Home, ChevronUp, ChevronDown } from "lucide-react"

type HousingStatus = 'homeless' | 'supported' | 'independent' | 'family' | 'group' | 'other'

interface AddressSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

export function AddressSection({ onSectionToggle, isExpanded }: AddressSectionProps) {
  // TODO: Replace with server-driven form state
  const addressInfo = {
    streetAddress: '',
    streetAddress2: '',
    city: '',
    state: '',
    zipCode: '',
    housingStatus: '' as HousingStatus,
    housingStatusOther: '',
    isTemporary: false,
    tempEndDate: null
  }

  const handleAddressInfoChange = (data: any) => {
    // TODO: Replace with server-driven form handling
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
                placeholder="Select state"
              >
                <Select.Content className="max-h-[200px] overflow-y-auto">
                  <Select.Item value="AL">Alabama</Select.Item>
                  <Select.Item value="AK">Alaska</Select.Item>
                  <Select.Item value="AZ">Arizona</Select.Item>
                  <Select.Item value="AR">Arkansas</Select.Item>
                  <Select.Item value="CA">California</Select.Item>
                  <Select.Item value="CO">Colorado</Select.Item>
                  <Select.Item value="CT">Connecticut</Select.Item>
                  <Select.Item value="DE">Delaware</Select.Item>
                  <Select.Item value="DC">District of Columbia</Select.Item>
                  <Select.Item value="FL">Florida</Select.Item>
                  <Select.Item value="GA">Georgia</Select.Item>
                  <Select.Item value="HI">Hawaii</Select.Item>
                  <Select.Item value="ID">Idaho</Select.Item>
                  <Select.Item value="IL">Illinois</Select.Item>
                  <Select.Item value="IN">Indiana</Select.Item>
                  <Select.Item value="IA">Iowa</Select.Item>
                  <Select.Item value="KS">Kansas</Select.Item>
                  <Select.Item value="KY">Kentucky</Select.Item>
                  <Select.Item value="LA">Louisiana</Select.Item>
                  <Select.Item value="ME">Maine</Select.Item>
                  <Select.Item value="MD">Maryland</Select.Item>
                  <Select.Item value="MA">Massachusetts</Select.Item>
                  <Select.Item value="MI">Michigan</Select.Item>
                  <Select.Item value="MN">Minnesota</Select.Item>
                  <Select.Item value="MS">Mississippi</Select.Item>
                  <Select.Item value="MO">Missouri</Select.Item>
                  <Select.Item value="MT">Montana</Select.Item>
                  <Select.Item value="NE">Nebraska</Select.Item>
                  <Select.Item value="NV">Nevada</Select.Item>
                  <Select.Item value="NH">New Hampshire</Select.Item>
                  <Select.Item value="NJ">New Jersey</Select.Item>
                  <Select.Item value="NM">New Mexico</Select.Item>
                  <Select.Item value="NY">New York</Select.Item>
                  <Select.Item value="NC">North Carolina</Select.Item>
                  <Select.Item value="ND">North Dakota</Select.Item>
                  <Select.Item value="OH">Ohio</Select.Item>
                  <Select.Item value="OK">Oklahoma</Select.Item>
                  <Select.Item value="OR">Oregon</Select.Item>
                  <Select.Item value="PA">Pennsylvania</Select.Item>
                  <Select.Item value="RI">Rhode Island</Select.Item>
                  <Select.Item value="SC">South Carolina</Select.Item>
                  <Select.Item value="SD">South Dakota</Select.Item>
                  <Select.Item value="TN">Tennessee</Select.Item>
                  <Select.Item value="TX">Texas</Select.Item>
                  <Select.Item value="UT">Utah</Select.Item>
                  <Select.Item value="VT">Vermont</Select.Item>
                  <Select.Item value="VA">Virginia</Select.Item>
                  <Select.Item value="WA">Washington</Select.Item>
                  <Select.Item value="WV">West Virginia</Select.Item>
                  <Select.Item value="WI">Wisconsin</Select.Item>
                  <Select.Item value="WY">Wyoming</Select.Item>
                </Select.Content>
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
                disabled
                className="bg-muted"
              />
            </div>

            {/* Different Mailing Address Toggle */}
            <div className="space-y-2 @lg:col-span-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="differentMailing"
                  checked={addressInfo.differentMailingAddress}
                  onCheckedChange={(checked) => handleAddressInfoChange({ differentMailingAddress: checked === true })}
                />
                <Label htmlFor="differentMailing" className="font-normal">
                  Mailing address is different from home address
                </Label>
              </div>
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
                  />
                </div>

                {/* Mailing State */}
                <div className="space-y-2">
                  <Label htmlFor="mailingState">State *</Label>
                  <Select
                    value={addressInfo.mailingState || ''}
                    onValueChange={(value) => handleAddressInfoChange({ mailingState: value })}
                    placeholder="Select state"
                  >
                    <Select.Content className="max-h-[200px] overflow-y-auto">
                      <Select.Item value="AL">Alabama</Select.Item>
                      <Select.Item value="AK">Alaska</Select.Item>
                      <Select.Item value="AZ">Arizona</Select.Item>
                      <Select.Item value="AR">Arkansas</Select.Item>
                      <Select.Item value="CA">California</Select.Item>
                      <Select.Item value="CO">Colorado</Select.Item>
                      <Select.Item value="CT">Connecticut</Select.Item>
                      <Select.Item value="DE">Delaware</Select.Item>
                      <Select.Item value="DC">District of Columbia</Select.Item>
                      <Select.Item value="FL">Florida</Select.Item>
                      <Select.Item value="GA">Georgia</Select.Item>
                      <Select.Item value="HI">Hawaii</Select.Item>
                      <Select.Item value="ID">Idaho</Select.Item>
                      <Select.Item value="IL">Illinois</Select.Item>
                      <Select.Item value="IN">Indiana</Select.Item>
                      <Select.Item value="IA">Iowa</Select.Item>
                      <Select.Item value="KS">Kansas</Select.Item>
                      <Select.Item value="KY">Kentucky</Select.Item>
                      <Select.Item value="LA">Louisiana</Select.Item>
                      <Select.Item value="ME">Maine</Select.Item>
                      <Select.Item value="MD">Maryland</Select.Item>
                      <Select.Item value="MA">Massachusetts</Select.Item>
                      <Select.Item value="MI">Michigan</Select.Item>
                      <Select.Item value="MN">Minnesota</Select.Item>
                      <Select.Item value="MS">Mississippi</Select.Item>
                      <Select.Item value="MO">Missouri</Select.Item>
                      <Select.Item value="MT">Montana</Select.Item>
                      <Select.Item value="NE">Nebraska</Select.Item>
                      <Select.Item value="NV">Nevada</Select.Item>
                      <Select.Item value="NH">New Hampshire</Select.Item>
                      <Select.Item value="NJ">New Jersey</Select.Item>
                      <Select.Item value="NM">New Mexico</Select.Item>
                      <Select.Item value="NY">New York</Select.Item>
                      <Select.Item value="NC">North Carolina</Select.Item>
                      <Select.Item value="ND">North Dakota</Select.Item>
                      <Select.Item value="OH">Ohio</Select.Item>
                      <Select.Item value="OK">Oklahoma</Select.Item>
                      <Select.Item value="OR">Oregon</Select.Item>
                      <Select.Item value="PA">Pennsylvania</Select.Item>
                      <Select.Item value="RI">Rhode Island</Select.Item>
                      <Select.Item value="SC">South Carolina</Select.Item>
                      <Select.Item value="SD">South Dakota</Select.Item>
                      <Select.Item value="TN">Tennessee</Select.Item>
                      <Select.Item value="TX">Texas</Select.Item>
                      <Select.Item value="UT">Utah</Select.Item>
                      <Select.Item value="VT">Vermont</Select.Item>
                      <Select.Item value="VA">Virginia</Select.Item>
                      <Select.Item value="WA">Washington</Select.Item>
                      <Select.Item value="WV">West Virginia</Select.Item>
                      <Select.Item value="WI">Wisconsin</Select.Item>
                      <Select.Item value="WY">Wyoming</Select.Item>
                    </Select.Content>
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
                  />
                </div>

                {/* Mailing Country */}
                <div className="space-y-2">
                  <Label htmlFor="mailingCountry">Country</Label>
                  <Input
                    id="mailingCountry"
                    value="United States"
                    disabled
                    className="bg-muted"
                  />
                </div>
              </>
            )}

            {/* Housing Status */}
            <div className="space-y-2 @lg:col-span-2">
              <Label htmlFor="housingStatus">Housing Status *</Label>
              <Select
                value={addressInfo.housingStatus}
                onValueChange={(value: HousingStatus) => handleAddressInfoChange({ housingStatus: value })}
                placeholder="Select housing status"
              >
                <Select.Content>
                  <Select.Item value="homeless">Homeless</Select.Item>
                  <Select.Item value="supported">Supported Housing</Select.Item>
                  <Select.Item value="independent">Independent</Select.Item>
                  <Select.Item value="family">With Family</Select.Item>
                  <Select.Item value="group">Group Home</Select.Item>
                  <Select.Item value="other">Other</Select.Item>
                </Select.Content>
              </Select>
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
} 