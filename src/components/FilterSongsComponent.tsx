import { Minus } from "lucide-react";
import { useEffect, useState } from "react";
import MySelectComponent from "./form/MySelectComponent";

export interface SongFilter {
  feature: string
  operation: string
  value: string
}

interface FilterSongsComponentProps {
  onFilterChange: (filters: SongFilter[]) => void
}

export default function FilterSongsComponent({onFilterChange}:FilterSongsComponentProps) {
  const featureOptions = [
    {
      value: "mood",
      label: "Mood"
    },
    {
      value: "genre",
      label: "Genre"
    },
    {
      value: "aggressive",
      label: "Aggressive"
    },
    {
      value: "engagement",
      label: "Engagement"
    },
    {
      value: "happy",
      label: "Happy"
    },
    {
      value: "relaxed",
      label: "Relaxed"
    },
    {
      value: "sad",
      label: "Sad"
    }
  ]

  const [feature, setFeature] = useState<any|null>(null);
  const [operation, setOperation] = useState<any|null>(null);
  const [featureValue, setFeatureValue] = useState<number|any|null>();

  // Select Options
  const [operationOptions, setOperationOptions] = useState<any[]>([])
  const [featureValueOpts, setFeatureValueOpts] = useState<any[]>([])

  const [classificationCriterias, setClassificationCriterias] = useState<any[]>([])

  const removeCriteriaFromClassification = (e:any, criteria:any) => {
    e.stopPropagation()

    setClassificationCriterias((prevState) => {
      const newState = prevState.filter((ele:any) => ele.feature != criteria.feature)
      return newState
    })
  }

  const setFeatureOperations = () => {
    let operations = []
    if (feature && (feature.value == "mood" || feature.value == "genre") ) {
      operations = [
        { value: 'in', label: 'In' },
        { value: 'notin', label: 'Not In' },
      ]
    } else {
      operations = [
        { value: '<', label: 'Less Then' },
        { value: '>', label: 'Greater Then' },
      ]
    }
    setOperationOptions(operations)
  }

  const setFeatureValues = () => {
    if (!feature) return;
    if (!["mood", "genre"].includes(feature.value)) return;

    let valueOptions = []
    if (feature.value == "mood") {
      valueOptions = ["action","adventure","advertising","background","ballad","calm","children","christmas","commercial","cool","corporate","dark","deep","documentary","drama","dramatic","dream","emotional","energetic","epic","fast","film","fun","funny","game","groovy","happy","heavy","holiday","hopeful","inspiring","love","meditative","melancholic","melodic","motivational","movie","nature","party","positive","powerful","relaxing","retro","romantic","sad","sexy","slow","soft","soundscape","space","sport","summer","trailer","travel","upbeat","uplifting"]
    } else {
      valueOptions = ["60s","70s","80s","90s","acidjazz","alternative","alternativerock","ambient","atmospheric","blues","bluesrock","bossanova","breakbeat","celtic","chanson","chillout","choir","classical","classicrock","club","contemporary","country","dance","darkambient","darkwave","deephouse","disco","downtempo","drumnbass","dub","dubstep","easylistening","edm","electronic","electronica","electropop","ethno","eurodance","experimental","folk","funk","fusion","groove","grunge","hard","hardrock","hiphop","house","idm","improvisation","indie","industrial","instrumentalpop","instrumentalrock","jazz","jazzfusion","latin","lounge","medieval","metal","minimal","newage","newwave","orchestral","pop","popfolk","poprock","postrock","progressive","psychedelic","punkrock","rap","reggae","rnb","rock","rocknroll","singersongwriter","soul","soundtrack","swing","symphonic","synthpop","techno","trance","triphop","world","worldfusion"]
    }

    setFeatureValueOpts(valueOptions)
  }

  const onAddCriteria = () => {
    if (!feature || !operation || !featureValue) {
      return
    }
    setClassificationCriterias((prevState) => {
      const newState = [...prevState]
  
      newState.push({
        feature: feature.value,
        operation: operation.value,
        value: Array.isArray(featureValue) ? featureValue.map((ele) => (ele.value)).join(',') : featureValue
      })
  
      setOperation(null)
      setFeatureValue(null)
      setFeature(null)  
      
      return newState
    })  
  }


  useEffect(() => {
    setOperation(null)
    setFeatureValue(null)
    setFeatureOperations()
    setFeatureValues()
  }, [feature])
  
  useEffect(() => {
    onFilterChange(classificationCriterias)
  }, [classificationCriterias])
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h2 className="text-white text-xl font-semibold pb-4">Criterias</h2>
          {classificationCriterias.map((criteria:any) => (
            <div key={criteria.feature}>
              <div className="font-semibold text-gray-300 hover:bg-gray-700 p-2 rounded-md max-w-full">
                <input type="checkbox" id="toggle1" className="peer hidden" />
                <label htmlFor="toggle1" className="cursor-pointer block">
                  <div className="flex items-center">

                    {criteria.feature}

                    <button
                      onClick={(e) => removeCriteriaFromClassification(e, criteria)} 
                      className="px-3 py-1 text-xsm rounded cursor-pointer mx-2 transition-all hover:bg-gray-800"
                    >
                      <Minus />
                    </button>

                  </div>

                </label>
                <div className="max-h-0 overflow-hidden transition-all duration-300 ease-in-out peer-checked:max-h-50 peer-checked:overflow-scroll">
                  <div className="mt-2 p-4 rounded-md bg-black">
                    <pre>
                      {JSON.stringify(criteria, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div>
        <h2 className="text-white text-xl font-semibold pb-4">Add Criteria</h2>

        <div className="mb-4">
          <label htmlFor="feature-select" className="block font-medium mb-2">
            Feature:
          </label>
          <MySelectComponent
            selectedValue={feature}
            onSelectChange={(ele) => setFeature(ele)}
            options={featureOptions} 
          />
        </div>

        <div className="mb-4">
          <label htmlFor="feature-select" className="block font-medium mb-2">
            Operation:
          </label>
          <MySelectComponent 
            selectedValue={operation}
            onSelectChange={(ele) => {setOperation(ele)}}
            options={operationOptions} 
          />
        </div>

        <div className="mb-4">
          <label htmlFor="feature-value" className="block font-medium mb-2">
            Value:
          </label>

          {feature && ["mood", "genre"].includes(feature.value) ? (
            <MySelectComponent
              selectedValue={featureValue}
              isMulti={true}
              onSelectChange={(ele) => setFeatureValue(ele)}
              options={featureValueOpts.map((item) => ({value: item, label: item}))} 
            />
          ): (
            <div>
              <input
                type="text"
                id="feature-value"
                value={featureValue ? featureValue : 0}
                onChange={(e) => setFeatureValue(parseInt(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Feature Value"
              />
            </div>
          )}
        </div>

        <div>
          <button
            onClick={onAddCriteria}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Add Criteria
          </button>
        </div>
      </div>
    </div>
  )
}