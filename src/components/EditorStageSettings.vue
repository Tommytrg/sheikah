<template>
  <LayoutTwoColumns>
    <template v-slot:left>
      <EditorSettings :template="currentTemplate" />
    </template>

    <template v-slot:upperRight>
      <Fieldset :title="$t('template_description_title')" type="help">
        <div>
          <p>{{ $t('template_description_0') }}</p>
          <p>{{ $t('template_description_1') }}</p>
        </div>
      </Fieldset>
    </template>

    <template v-slot:bottomRight>
      <Fieldset :title="$t('variables_description_title')" type="help">
        <div>
          <p>{{ $t('variables_description_0') }}</p>
          <p>{{ $t('variables_description_1') }}</p>
        </div>
      </Fieldset>
    </template>
  </LayoutTwoColumns>
</template>

<script>
import { mapState } from 'vuex'
import LayoutTwoColumns from '@/components/LayoutTwoColumns'
import EditorSettings from '@/components/EditorSettings'
import Fieldset from '@/components/Fieldset'

export default {
  name: 'EditorStageSettings',
  components: {
    Fieldset,
    EditorSettings,
    LayoutTwoColumns,
  },
  computed: {
    ...mapState({
      currentTemplate: state => state.rad.currentTemplate,
    }),
  },
}
</script>

<docs>
### Example
```jsx

  <EditorStageSettings />
```
</docs>
