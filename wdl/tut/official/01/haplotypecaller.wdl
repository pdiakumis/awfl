workflow helloHaplotypeCaller {
  call haplotypeCaller
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
           --native-pair-hmm-threads 16 \
           -O ${sampleName}.raw.indels.snps.vcf
    }

    output {
      File rawVCF = "${sampleName}.raw.indels.snps.vcf"
    }
}

