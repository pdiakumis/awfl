
workflow SimpleVariantDetection {
  File gatk
  File refFasta
  File refIndex
  File refDict
  String name

  call haplotypeCaller { 
    input: 
      sampleName=name,
      RefFasta=refFasta,
      GATK=gatk,
      RefIndex=refIndex,
      RefDict=refDict
  }

  call select as selectSNPS {
    input: 
      type="SNP",
      rawVCF=haplotypeCaller.rawVCF,
      sampleName=name,
      RefFasta=refFasta,
      GATK=gatk,
      RefIndex=refIndex,
      RefDict=refDict
  }

  call select as selectIndels {
    input: 
      type="INDEL",
      rawVCF=haplotypeCaller.rawVCF,
      sampleName=name,
      RefFasta=refFasta,
      GATK=gatk,
      RefIndex=refIndex,
      RefDict=refDict
  }
  
  call hardFilterSNP { 
    input:
      rawSNPs=selectSNPS.rawSubset,
      sampleName=name, 
      RefFasta=refFasta, 
      GATK=gatk, 
      RefIndex=refIndex, 
      RefDict=refDict

  }

  call hardFilterIndel { 
    input:
      rawIndels=selectIndels.rawSubset,
      sampleName=name, 
      RefFasta=refFasta, 
      GATK=gatk, 
      RefIndex=refIndex, 
      RefDict=refDict
  }

  call combine {
    input:
      filteredSNPs=hardFilterSNP.filteredSNPs,
      filteredIndels=hardFilterIndel.filteredIndels,
      sampleName=name, 
      RefFasta=refFasta, 
      GATK=gatk, 
      RefIndex=refIndex, 
      RefDict=refDict
  }

}

task haplotypeCaller {
    File GATK
    File RefFasta
    File RefIndex
    File RefDict
    String sampleName
    File inputBAM
    File bamIndex

    command {
      java -jar ${GATK} \
           HaplotypeCaller \
           -R ${RefFasta} \
           -I ${inputBAM} \
           -O ${sampleName}.raw.indels.snps.vcf
    }

    output {
      File rawVCF = "${sampleName}.raw.indels.snps.vcf"
    }
}

task select {
    File GATK
    File RefFasta
    File RefIndex
    File RefDict
    String sampleName
    String type
    File rawVCF

    command {
      java -jar ${GATK} \
           SelectVariants \
           -R ${RefFasta} \
           -V ${rawVCF} \
           -select-type ${type} \
           -O ${sampleName}_raw.${type}.vcf
    }

    output {
      File rawSubset = "${sampleName}_raw.${type}.vcf"
    }
}

task hardFilterSNP {
    File GATK
    File RefFasta
    File RefIndex
    File RefDict
    String sampleName
    File rawSNPs

    command {
      java -jar ${GATK} \
           VariantFiltration \
           -R ${RefFasta} \
           -V ${rawSNPs} \
           --filter-expression "FS > 60.0" \
           --filter-name "snp_filter" \
           -O ${sampleName}.filtered.snps.vcf
    }

    output {
      File filteredSNPs = "${sampleName}.filtered.snps.vcf"

    }
}

task hardFilterIndel {
    File GATK
    File RefFasta
    File RefIndex
    File RefDict
    String sampleName
    File rawIndels

    command {
      java -jar ${GATK} \
           VariantFiltration \
           -R ${RefFasta} \
           -V ${rawIndels} \
           --filter-expression "FS > 200.0" \
           --filter-name "indel_filter" \
           -O ${sampleName}.filtered.indels.vcf
    }

    output {
      File filteredIndels = "${sampleName}.filtered.indels.vcf"

    }
}

task combine {
    File GATK
    File RefFasta
    File RefIndex
    File RefDict
    String sampleName
    File filteredSNPs
    File filteredIndels

    command {
      java -jar ${GATK} \
           MergeVcfs \
           -R ${RefFasta} \
           -I ${filteredSNPs} \
           -I ${filteredIndels} \
           -O ${sampleName}.filtered.snps.indels.vcf
    }

    output {
      File filteredVCF =  "${sampleName}.filtered.snps.indels.vcf"
    }
}

