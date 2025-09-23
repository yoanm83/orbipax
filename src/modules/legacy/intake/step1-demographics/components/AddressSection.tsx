'use client'

import { useIntakeFormStore } from '@/lib/store/intake-form-store'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Home, ChevronUp, ChevronDown, MapPin } from "lucide-react"

type HousingStatus = 'homeless' | 'supported' | 'independent' | 'family' | 'group' | 'other'

interface AddressSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

export function AddressSection({ onSectionToggle, isExpanded }: AddressSectionProps) {
  const { addressInfo, setFormData } = useIntakeFormStore()

  const handleAddressInfoChange = (data: Partial<typeof addressInfo>) => {
    setFormData('addressInfo', data)
  }

  return (
    <Card className="w-full rounded-2xl shadow-md mb-6">
      <div
        className="p-6 flex justify-between items-center cursor-pointer"
        onClick={onSectionToggle}
      >
        <div className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Address Information</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Home Address */}
            <div className="space-y-2">
              <Label htmlFor="homeAddress">Home Address *</Label>
              <Input
                id="homeAddress"
                placeholder="Enter your home address"
                required
                value={addressInfo.homeAddress}
                onChange={(e) => handleAddressInfoChange({ homeAddress: e.target.value })}
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
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Select
                value={addressInfo.state}
                onValueChange={(value) => handleAddressInfoChange({ state: value })}
              >
                <SelectTrigger id="state">
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
            <div className="space-y-2 md:col-span-2">
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
                  >
                    <SelectTrigger id="mailingState">
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
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="housingStatus">Housing Status *</Label>
              <Select
                value={addressInfo.housingStatus}
                onValueChange={(value: HousingStatus) => handleAddressInfoChange({ housingStatus: value })}
              >
                <SelectTrigger id="housingStatus">
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
        </CardContent>
      )}
    </Card>
  )
} 