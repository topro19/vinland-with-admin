import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { updateThemeSettings } from './actions'

export const dynamic = 'force-dynamic'

export default async function ThemePage() {
  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }

  const defaultSettings = {
    primaryColor: '#00461a',
    secondaryColor: '#755b00',
    accentColor: '#ffdad6',
    backgroundColor: '#fdf9ed',
    textColor: '#1c1c15',
    buttonColor: '#105223',
    headingFont: 'Nunito',
    bodyFont: 'Nunito Sans',
    headingWeight: '800'
  }

  let settings = defaultSettings
  try {
    const fetched = await prisma.themeSettings.findUnique({ where: { id: 'global' } })
    if (fetched) settings = fetched
  } catch (err) {
    console.warn('Prisma query skipped in theme settings:', err)
  }

  return (
    <div className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-gray-900">Theme & Typography Settings</h2>
        <p className="mt-1 text-sm text-gray-500">
          Modify the brand colors and typography. These token values will be dynamically injected into the frontend without altering any CSS file structure or layout files.
        </p>
      </div>

      <form action={updateThemeSettings} className="px-8 py-6 space-y-8">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase mb-4 border-b pb-2">Brand Colors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 block mb-1">Primary Color</span>
              <div className="flex items-center space-x-3">
                <input type="color" name="primaryColor" defaultValue={settings.primaryColor} className="h-10 w-14 p-1 rounded border border-gray-200 cursor-pointer" />
                <span className="text-sm text-gray-500 font-mono">{settings.primaryColor}</span>
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 block mb-1">Secondary Color</span>
              <div className="flex items-center space-x-3">
                <input type="color" name="secondaryColor" defaultValue={settings.secondaryColor} className="h-10 w-14 p-1 rounded border border-gray-200 cursor-pointer" />
                <span className="text-sm text-gray-500 font-mono">{settings.secondaryColor}</span>
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 block mb-1">Accent (Error) Color</span>
              <div className="flex items-center space-x-3">
                <input type="color" name="accentColor" defaultValue={settings.accentColor} className="h-10 w-14 p-1 rounded border border-gray-200 cursor-pointer" />
                <span className="text-sm text-gray-500 font-mono">{settings.accentColor}</span>
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 block mb-1">Background Color</span>
              <div className="flex items-center space-x-3">
                <input type="color" name="backgroundColor" defaultValue={settings.backgroundColor} className="h-10 w-14 p-1 rounded border border-gray-200 cursor-pointer" />
                <span className="text-sm text-gray-500 font-mono">{settings.backgroundColor}</span>
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 block mb-1">Text Color</span>
              <div className="flex items-center space-x-3">
                <input type="color" name="textColor" defaultValue={settings.textColor} className="h-10 w-14 p-1 rounded border border-gray-200 cursor-pointer" />
                <span className="text-sm text-gray-500 font-mono">{settings.textColor}</span>
              </div>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 block mb-1">Button Color</span>
              <div className="flex items-center space-x-3">
                <input type="color" name="buttonColor" defaultValue={settings.buttonColor} className="h-10 w-14 p-1 rounded border border-gray-200 cursor-pointer" />
                <span className="text-sm text-gray-500 font-mono">{settings.buttonColor}</span>
              </div>
            </label>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase mb-4 border-b pb-2">Typography Tokens</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <label className="block">
              <span className="text-sm font-medium text-gray-700 block mb-1">Heading Font</span>
              <input type="text" name="headingFont" defaultValue={settings.headingFont} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 block mb-1">Body Font</span>
              <input type="text" name="bodyFont" defaultValue={settings.bodyFont} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-gray-700 block mb-1">Heading Weight</span>
              <input type="text" name="headingWeight" defaultValue={settings.headingWeight} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm" />
            </label>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="bg-gray-900 text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
