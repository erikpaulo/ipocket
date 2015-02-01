package com.softb.ipocket.account.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import javax.inject.Inject;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.lang.time.DateUtils;
import org.apache.tomcat.util.http.fileupload.FileItemIterator;
import org.apache.tomcat.util.http.fileupload.FileItemStream;
import org.apache.tomcat.util.http.fileupload.FileUploadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import com.softb.ipocket.account.model.AccountEntry;
import com.softb.ipocket.account.model.AccountEntryImport;
import com.softb.ipocket.account.repository.AccountEntryRepository;
import com.softb.system.security.service.UserAccountService;

@Service
public class AccountEntryUploadService {
	
	@Autowired
	private AccountEntryRepository entryRepository;
	
	@Inject
	private UserAccountService userAccountService;

	/**
	 * Responsável por processar arquivos com lançamentos do tipo CSV separados por ;.
	 * @param accountId Número da conta onde os lançamentos serão feitos.
	 * @param fileIterator Arquivo.
	 * @return
	 * @throws ParseException 
	 * @throws IOException 
	 * @throws FileUploadException 
	 * @throws DataAccessException 
	 */
	public List<AccountEntryImport> csvImport(Integer accountId, FileItemIterator fileIterator) throws DataAccessException, FileUploadException, IOException, ParseException{
		List<AccountEntryImport> entriesToImport = new ArrayList<AccountEntryImport>();
		AccountEntryImport entryToImport = null;
		String[] dateFormat = {"dd/MM/yyyy"};
		NumberFormat nf = NumberFormat.getCurrencyInstance(new Locale("pt","BR"));
		
		// Caso tenha sido enviado mais de um arquivo, itera por eles.
		while (fileIterator.hasNext()) {
			FileItemStream stream = fileIterator.next();
			BufferedReader reader = new BufferedReader(new InputStreamReader(stream.openStream()));
			
			// Recupera o delimitador do arquivo.
			char delimiter = defineDelimiter(reader);
			
			for(CSVRecord record : CSVFormat.EXCEL.withDelimiter(delimiter).parse(reader).getRecords()) {
				 entryToImport = new AccountEntryImport(DateUtils.parseDate(record.get(0), dateFormat), record.get(1).trim(), nf.parse(record.get(2)).doubleValue(), null, null, true);
					
					// Verifica se existe um lançamento na conta com mesma data e valor. Se existir aponta como provável conflito.
					List<AccountEntry> conflicts =  entryRepository.listAllByUserDateAmount(userAccountService.getCurrentUser().getId(), accountId, entryToImport.getDate(), entryToImport.getAmount());
					if (conflicts.size() > 0) {
						entryToImport.setOk(false);
						entryToImport.setConflicts(conflicts);
					}
					
					entriesToImport.add(entryToImport);
			}
			reader.close();
		}

		return entriesToImport;
	}

	/**
	 * Verifica se o delimintador do arquivo CSV é ; ou ,.
	 * @param reader Stream do arquivo
	 * @return Delimitador do arquivo
	 * @throws IOException
	 */
	private char defineDelimiter(BufferedReader reader) throws IOException {
		reader.mark(1000);
		char delimiter = (reader.readLine().split(";").length > 1 ? ';' : ',');
		reader.reset();
		
		return delimiter;
	}
}
